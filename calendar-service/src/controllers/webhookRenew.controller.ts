import { Request, Response } from 'express';
import { renewExpiringChannels } from '../services/webhook.service.js';

export async function renewChannels(req: Request, res: Response) {
  await renewExpiringChannels();
  res.json({ message: 'success updated channels' });
}