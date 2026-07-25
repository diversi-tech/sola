import { google } from 'googleapis';
import crypto from 'crypto';
import { decryptToken } from '../utils/crypto.util.js';
import { saveWebhookChannel, getExpiringChannels } from './webhook.repository.js';

const oauth2Client = new google.auth.OAuth2(
  process.env.CALNEDAR_GOOGLE_CLIENT_ID,
  process.env.CALNEDAR_GOOGLE_CLIENT_SECRET,
  process.env.CALNEDAR_GOOGLE_REDIRECT_URI
);

const WEBHOOK_CALLBACK_URL = process.env.WEBHOOK_CALLBACK_URL as string;

if (!WEBHOOK_CALLBACK_URL) {
  console.warn('[Webhook] WEBHOOK_CALLBACK_URL is not set in environment variables.');
}

function getChannelRenewalThreshold(): number {
  const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
  return Date.now() + twoDaysMs;
}

export async function registerWebhookChannel(
  employee_id: number,
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
    throw new Error(`Failed to register webhook channel for employee ${employee_id}: ${err.message}`);
  }

  const resourceId = response.data.resourceId;
  const expiration = response.data.expiration;

  if (!resourceId || !expiration) {
    throw new Error(`Google did not return resourceId/expiration for employee ${employee_id}`);
  }

  await saveWebhookChannel(employee_id, {
    webhook_channel_id: channelId,
    webhook_resource_id: resourceId,
    webhook_expiration: Number(expiration),
  });

  console.log(`[Webhook] Registered channel for employee ${employee_id}, expires ${new Date(Number(expiration)).toISOString()}`);
}

export async function unregisterWebhookChannel(
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
    console.warn(`[Webhook] Failed to unregister channel ${channelId}: ${err.message}`);
  }
}

export async function renewExpiringChannels(): Promise<void> {
  const threshold = getChannelRenewalThreshold();

  const expiringEmployees = await getExpiringChannels(threshold);

  if (expiringEmployees.length === 0) {
    console.log('[Webhook] No channels need renewal.');
    return;
  }

  for (const employee of expiringEmployees) {
    try {
      if (employee.webhook_channel_id && employee.webhook_resource_id) {
        await unregisterWebhookChannel(
          employee.webhook_channel_id,
          employee.webhook_resource_id,
          employee.refresh_token
        );
      }
      await registerWebhookChannel(employee.id, employee.refresh_token);
    } catch (err: any) {
      console.error(`[Webhook] Renewal failed for employee ${employee.id}: ${err.message}`);
    }
  }
}