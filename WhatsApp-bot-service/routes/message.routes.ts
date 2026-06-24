import express from 'express';
import { handleSendInternalMessage } from '../controllers/message.controller';

const router = express.Router();

router.post('/send-message', handleSendInternalMessage);

export default router;