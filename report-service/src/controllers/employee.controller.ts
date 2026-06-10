import { Request, Response } from 'express';

export const analyzeAndParseFeedback = (req: Request, res: Response) => {
    const { manager_id, text } = req.body;

    // TODO: Send text to LLM for sentiment analysis and metrics extraction


    res.status(200).json({
        message: "Data successfully transferred from the client to the server!",
        receivedData: { manager_id, text }
    });
};