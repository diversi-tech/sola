import { Router } from 'express';
import { handleGoogleWebhook } from '../controllers/webhook.controller.js';
import { renewChannels } from '../controllers/webhookRenew.controller.js';

const router = Router();

router.post('/google-calendar', handleGoogleWebhook);
router.post('/renew', renewChannels);

export default router;