import { Request, Response } from 'express';
import { processAndSaveFeedback } from '../services/report.service.js'; 
import { sendCreatedResult, sendErrorResult } from '../utils/responseHandler.js';

export const handleIncomingFeedback = async (req: Request, res: Response) => {
    try {
        const { manager_id, text} = req.body;

        const savedReport = await processAndSaveFeedback(manager_id, text);
        return sendCreatedResult(res, {
            message: "Report successfully processed and saved!",
            manager_id: manager_id,
            savedReport: savedReport
        });

    } catch (error: any) {
        console.error(" Full Error Details:", error);
        
        const manager_id = req.body.manager_id;
        
        return sendErrorResult(
            res, 
            "Failed to save the report to the database.", 
            500,
            { manager_id: manager_id } 
        );
    }
};