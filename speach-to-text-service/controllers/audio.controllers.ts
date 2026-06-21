import { Request, Response } from 'express';
import * as audioService from '../services/audio.service';
import * as errorHandlerService from '../services/error-handler.service';

const MAX_SIZE_BYTES = 25 * 1024 * 1024;

export const processAudioRequest = async (req: Request, res: Response): Promise<void> => {
  let currentUserId: string | undefined = req.body?.userId;

  try {
    if (!req.file) {
      const errorMessage = 'Bad Request: No audio file provided.';
      
      const userFriendlyMessage = errorHandlerService.handleProcessResult(400, errorMessage, currentUserId || 'unknown');

      res.status(400).json({ error: userFriendlyMessage });
      return;
    }

    if (!currentUserId) {
      const errorMessage = 'Bad Request: Missing userId.';
      
      const userFriendlyMessage = errorHandlerService.handleProcessResult(400, errorMessage, 'unknown');

      res.status(400).json({ error: userFriendlyMessage });
      return;
    }

    if (req.file.size > MAX_SIZE_BYTES) {
      const errorMessage = 'Payload Too Large: Audio file exceeds 25MB limit.';
      
      const userFriendlyMessage = errorHandlerService.handleProcessResult(413, errorMessage, currentUserId);

      res.status(413).json({ error: userFriendlyMessage });
      return;
    }

    const transcriptionResult = await audioService.handleAudioProcessingPipeline(
      req.file,
      currentUserId
    );

    res.status(200).json({
      status: 'success',
      text: transcriptionResult
    });

  } catch (error: any) {
    console.error('Controller caught an error:', error);
    const errorMessage = error?.message || 'Audio processing failed during transcription.';

    const userFriendlyMessage = errorHandlerService.handleProcessResult(500, errorMessage, currentUserId || 'unknown');

    res.status(500).json({ error: userFriendlyMessage });
  }
};