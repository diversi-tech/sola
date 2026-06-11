import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { sendSuccessResult, sendErrorResult } from '../utils/responseHandler.js';


export const analyzeAndParseFeedback = async (req: Request, res: Response) => {
    try {
        const { manager_id, text } = req.body;

        // TODO: Send text to LLM for sentiment analysis and metrics extraction

        // TODO 2: Replacing the mock data with real data received from the LLM after text processing
        const dummyData = {
            employee_id: 1,
            manager_id: manager_id || 2,
            metric_scores: { loyalty: 8, independence: 9, pride: 7 },
            text_summary: "זהו סיכום זמני (Mock) שנוצר בשרת לבדיקת השמירה."
        };
        const { data, error } = await supabase
            .from('Reports')
            .insert([dummyData])
            .select();

        if (error) {
            throw error;
        }

        return sendSuccessResult(res, {
            message: "Report successfully processed and saved!",
            savedReport: data
        }, 201);

    } catch (error: any) {
        console.error("Error saving to database:", error.message || error);
        return sendErrorResult(res, "Failed to save the report to the database.", 500);
    }

};