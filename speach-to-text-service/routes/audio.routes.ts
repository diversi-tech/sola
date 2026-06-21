import express from 'express';
import multer from 'multer';
import * as audioController from '../controllers/audio.controllers';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
router.post('/v1/audio/process', upload.single('audio'), audioController.processAudioRequest);

export default router;
