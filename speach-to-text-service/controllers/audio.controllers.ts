import { Request, Response } from 'express';
import * as audioService from '../services/audio.service';
import * as errorHandlerService from '../services/error-handler.service'; 

const MAX_SIZE_BYTES = 25 * 1024 * 1024;

export const processAudioRequest = async (req: Request, res: Response): Promise<void> => {
  
  let currentUserId: string | undefined = req.body?.userId;

  try {
    if (!req.file) {
      const errorMessage = 'Bad Request: No audio file provided.';
      
      await errorHandlerService.handleProcessResult({
        userId: currentUserId || 'unknown',
        message: errorMessage,
        status: "400"
      });

      res.status(400).json({ error: errorMessage });
      return;
    }

    if (!currentUserId) {
      const errorMessage = 'Bad Request: Missing userId.';
      
      await errorHandlerService.handleProcessResult({
        userId: 'unknown',
        message: errorMessage,
        status: "400"
      });

      res.status(400).json({ error: errorMessage });
      return;
    }

   
    if (req.file.size > MAX_SIZE_BYTES) {
      const errorMessage = 'Payload Too Large: Audio file exceeds 25MB limit.';
      
      await errorHandlerService.handleProcessResult({
        userId: currentUserId,
        message: errorMessage,
        status: "413"
      });

      res.status(413).json({ error: errorMessage });
      return;
    }

    const transcriptionResult = await audioService.handleAudioProcessingPipeline(req.file, { userId: currentUserId });

    await errorHandlerService.handleProcessResult({
      userId: currentUserId,
      text: transcriptionResult,
      status: "200"
    });

    res.status(200).json({ 
      status: 'success',
      text: transcriptionResult 
    });

  } catch (error: any) {
    console.error('Controller caught an error:', error);

    const errorMessage = error?.message || 'Audio processing failed during transcription.';

    await errorHandlerService.handleProcessResult({
      userId: currentUserId || 'unknown',
      message: errorMessage,
      status: "500"
    });

    res.status(500).json({ error: errorMessage });
  }
};