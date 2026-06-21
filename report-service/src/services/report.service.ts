import { supabase } from '../config/supabase.js';
import { findEmployeeByName } from './employee.service.js';
import { getActiveCategories } from './category.service.js';
import { LLMFactory } from '../ai/llm.factory.js';


const aiProvider = LLMFactory.getProvider();

export const processAndSaveFeedback = async (manager_id: number, text: string, audio_url?: string) => {
    try {
        const categories = await getActiveCategories();
        
        const llmMetrics = await aiProvider.analyzeFeedback(text, categories);
        
        const extractedName = llmMetrics.employee_name;
        if (!extractedName) {
            throw new Error("The AI could not identify an employee name in the text.");
        }

        const employeeId = await findEmployeeByName(extractedName);

        const realData = {
            employee_id: employeeId,
            manager_id: manager_id || null,
            metric_scores: llmMetrics.metric_scores,
            text_summary: llmMetrics.text_summary,
            audio_link: audio_url || null,
        };

        const { data, error } = await supabase
            .from('Reports')
            .insert([realData])
            .select();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        throw error;
    }
};