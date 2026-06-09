import { Request, Response } from 'express';
import * as audioService from '../services/audio.service';

export const processAudioRequest = (req: Request, res: Response): void => {
  try {
    //  בדיקת קיום קובץ
    if (!req.file) {
      res.status(400).json({ error: 'Bad Request: No audio file provided.' });
      return;
    }

    // חילוץ ה-userId מה-Body של הבקשה
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ error: 'Bad Request: Missing userId.' });
      return;
    }

    //  בדיקת גודל קובץ (מקסימום 25MB)
    const MAX_SIZE_BYTES = 25 * 1024 * 1024;
    if (req.file.size > MAX_SIZE_BYTES) {
      res.status(413).json({ error: 'Payload Too Large: Limit is 25MB.' });
      return;
    }

    //  הפעלת ה-Service ברקע ללא המתנה (ללא await)
    audioService.handleAudioProcessingPipeline(req.file, { userId }).catch(err => {
      console.error('Background processing error:', err);
    });

    //  תשובה מהירה לבוט
    res.status(202).json({ message: 'Audio processing started.' });

  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};