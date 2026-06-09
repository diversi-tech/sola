import { Router } from 'express';
import { verifyWebhook, receiveWebhookEvent } from '../controllers/webhook.controller';

const router = Router();

// נקודת קצה לאימות ה-Webhook מול Meta (GET)
router.get('/', verifyWebhook);

// נקודת קצה לקבלת אירועים מ-Meta (POST)
router.post('/', receiveWebhookEvent);

export default router;