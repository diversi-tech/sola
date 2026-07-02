import { google } from 'googleapis';
import crypto from 'crypto';
import { decryptToken } from '../utils/crypto.util.js';
import { saveWebhookChannel, getExpiringChannels } from './webhook.repository.js';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const WEBHOOK_CALLBACK_URL = process.env.WEBHOOK_CALLBACK_URL as string;

if (!WEBHOOK_CALLBACK_URL) {
  console.warn('[Webhook] WEBHOOK_CALLBACK_URL is not set in environment variables.');
}

export async function registerWebhookChannel(
  user_id: number,
  encryptedRefreshToken: string
): Promise<void> {
  const decryptedToken = decryptToken(encryptedRefreshToken);

  oauth2Client.setCredentials({ refresh_token: decryptedToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const channelId = crypto.randomUUID();

  let response;
  try {
    response = await calendar.events.watch({
      calendarId: 'primary',
      requestBody: {
        id: channelId,
        type: 'web_hook',
        address: WEBHOOK_CALLBACK_URL,
      },
    });
  } catch (err: any) {
    throw new Error(`Failed to register webhook channel for user ${user_id}: ${err.message}`);
  }

  const resourceId = response.data.resourceId;
  const expiration = response.data.expiration;

  if (!resourceId || !expiration) {
    throw new Error(`Google did not return resourceId/expiration for user ${user_id}`);
  }

  await saveWebhookChannel(user_id, {
    webhook_channel_id: channelId,
    webhook_resource_id: resourceId,
    webhook_expiration: Number(expiration),
  });

  console.log(`[Webhook] Registered channel for user ${user_id}, expires ${new Date(Number(expiration)).toISOString()}`);
}

export async function stopWebhookChannel(
  channelId: string,
  resourceId: string,
  encryptedRefreshToken: string
): Promise<void> {
  const decryptedToken = decryptToken(encryptedRefreshToken);

  oauth2Client.setCredentials({ refresh_token: decryptedToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    await calendar.channels.stop({
      requestBody: {
        id: channelId,
        resourceId: resourceId,
      },
    });
  } catch (err: any) {
    console.warn(`[Webhook] Failed to stop channel ${channelId}: ${err.message}`);
  }
}

export async function renewExpiringChannels(): Promise<void> {
  const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
  const threshold = Date.now() + twoDaysMs;

  const expiringUsers = await getExpiringChannels(threshold);

  if (expiringUsers.length === 0) {
    console.log('[Webhook] No channels need renewal.');
    return;
  }

  for (const user of expiringUsers) {
    try {
      if (user.webhook_channel_id && user.webhook_resource_id) {
        await stopWebhookChannel(
          user.webhook_channel_id,
          user.webhook_resource_id,
          user.refresh_token
        );
      }
      await registerWebhookChannel(user.id, user.refresh_token);
    } catch (err: any) {
      console.error(`[Webhook] Renewal failed for user ${user.id}: ${err.message}`);
    }
  }
}