import { Request, Response } from 'express';
import { processAndSaveFeedback } from '../services/report.service.js';
import {
    sendCreatedResult,
    sendErrorResult,
    sendBadRequestResult,
    sendNotFoundResult,
    HttpStatusCode
} from '../utils/responseHandler.js';

export const handleIncomingFeedback = async (req: Request, res: Response) => {
    try {
        const { manager_id, text} = req.body;


        if (!text || text.trim() === '') {
            return sendBadRequestResult(res, "Feedback text is missing or empty");
        }
        const savedReport = await processAndSaveFeedback(manager_id, text);


        return sendCreatedResult(res, {
            message: "Report successfully processed and saved!",
            manager_id: manager_id,
            savedReport: savedReport
        });

    } catch (error: any) {
        console.error("Full Error Details:", error);

        const manager_id = req.body?.manager_id;

        if (error.message && (error.message.includes("was not found") || error.message.includes("could not identify"))) {
            return sendNotFoundResult(res, "Employee not found in the system");
        }

        if (error.code === '22P02' || error.code === '23503') {
            return sendBadRequestResult(res, "Invalid manager ID");
        }

        if (error.status === 503 || (error.message && error.message.includes("503"))) {
            return sendErrorResult(res, "Analysis service is currently unavailable", HttpStatusCode.SERVICE_UNAVAILABLE, { manager_id });
        }

        return sendErrorResult(res, "Failed to save the report to the database.", 500, { manager_id });
    }
};