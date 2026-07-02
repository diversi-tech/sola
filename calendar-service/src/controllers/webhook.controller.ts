import { Request, Response, NextFunction } from 'express';
import { getUserByChannelId } from '../services/webhook.repository.js';
import { syncUserCalendarIncremental } from '../services/meeting.service.js';

export const handleGoogleWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const channelId = req.header('X-Goog-Channel-ID');
    const resourceState = req.header('X-Goog-Resource-State');
    const resourceId = req.header('X-Goog-Resource-ID');

    console.log(`[Webhook] Received: channel=${channelId}, state=${resourceState}, resource=${resourceId}`);
    if (resourceState === 'sync') {
      res.status(200).send('Sync acknowledged');
      return;
    }

    if (!channelId) {
      console.warn('[Webhook] Missing X-Goog-Channel-ID header');
      res.status(400).send('Missing channel id');
      return;
    }

    const user = await getUserByChannelId(channelId);

    if (!user) {
      console.warn(`[Webhook] No user found for channel ${channelId}`);
      res.status(200).send('Unknown channel');
      return;
    }
    res.status(200).send('Notification received');

    syncUserCalendarIncremental(user.id, user.refresh_token, user.sync_token).catch((err) => {
      console.error(`[Webhook] Incremental sync failed for user ${user.id}:`, err);
    });

  } catch (err: any) {
    next(err);
  }
};