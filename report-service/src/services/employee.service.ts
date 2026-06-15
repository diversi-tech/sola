import { supabase } from '../config/supabase.js';

export const processAndSaveReport = async (manager_id: number, text: string) => {
    // TODO: Send text to LLM for sentiment analysis and metrics extraction

    // TODO 2: Replacing the mock data with real data received from the LLM
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

    return data;
};