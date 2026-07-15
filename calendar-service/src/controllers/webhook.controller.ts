import { Request, Response, NextFunction } from 'express';
import { getEmployeeByChannelId } from '../services/webhook.repository.js';
import { syncEmployeeCalendarIncremental } from '../services/meeting.service.js';

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

    const employee = await getEmployeeByChannelId(channelId);

    if (!employee) {
      console.warn(`[Webhook] No employee found for channel ${channelId}`);
      res.status(200).send('Unknown channel');
      return;
    }

    res.status(200).send('Notification received');

    syncEmployeeCalendarIncremental(employee.id, employee.refresh_token, employee.sync_token).catch((err) => {
      console.error(`[Webhook] Incremental sync failed for employee ${employee.id}:`, err);
    });

  } catch (err: any) {
    next(err);
  }
};