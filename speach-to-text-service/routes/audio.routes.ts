import express from 'express';
import multer from 'multer';
import * as audioControllers from '../controllers/audio.controllers';
import * as errorHandlerService from '../services/error-handler.service'; 
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() }).single('audio');

router.post('/process', (req, res, next) => {
  upload(req, res, (err) => {
    
    if (err) {
      const userFriendlyMessage = errorHandlerService.handleProcessResult(400, 'unexpected field', req.body?.userId || 'unknown');
      return res.status(400).json({ error: userFriendlyMessage });
    }
    
    audioControllers.processAudioRequest(req, res).catch(next);
  });
});

export default router;