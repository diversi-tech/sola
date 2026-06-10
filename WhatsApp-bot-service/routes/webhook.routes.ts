import { Router } from 'express';
import { verifymetaWebhook, receiveWebhookEvent } from '../controllers/webhook.controller';

const router = Router();


router.get('/', verifymetaWebhook);


router.post('/', receiveWebhookEvent);

export default router;