import { Request, Response } from 'express';
import { processAndSaveReport } from '../services/employee.service.js'; // ייבוא של הסרביס
import { sendSuccessResult, sendErrorResult } from '../utils/responseHandler.js';

export const analyzeAndParseFeedback = async (req: Request, res: Response) => {
    try {
        const { manager_id, text } = req.body;

        const savedReport = await processAndSaveReport(manager_id, text);

        return sendSuccessResult(res, {
            message: "Report successfully processed and saved!",
            savedReport: savedReport
        }, 200);

    } catch (error: any) {
        console.error("Error saving to database:", error.message || error);
        return sendErrorResult(res, "Failed to save the report to the database.", 500);
    }
};