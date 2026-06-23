import { Router } from 'express';
import { verifyMetaWebhook, receiveWebhookEvent } from '../controllers/webhook.controller';

const router = Router();


router.get('/', verifyMetaWebhook);


router.post('/', receiveWebhookEvent);

export default router;