import { supabase } from '../config/supabase.js';
import { getActiveCategories } from './category.service.js';
import { LLMFactory } from '../ai/llm.factory.js';

const aiProvider = LLMFactory.getProvider();

export const processAndSaveFeedback = async (manager_id: number, text: string) => {
    try {
        const categories = await getActiveCategories();

        const llmResult = await aiProvider.analyzeFeedback(text, categories);

        const detectedLanguage = llmResult.detected_language;
        const feedbackData = llmResult.employee_feedback;

  
        const extractedName = feedbackData.employee_name;
        if (!extractedName) {
            throw new Error("The AI could not identify an employee name in the text.");
        }

        const THRESHOLD = 0.6;

        const { data: matchedEmployees, error: matchError } = await supabase
            .rpc('match_employee_name', {
                search_name: extractedName,
                match_threshold: THRESHOLD
            });

        if (matchError) {
            console.error('Error finding employee with fuzzy search:', matchError);
            throw matchError;
        }

        if (!matchedEmployees || matchedEmployees.length === 0) {
            throw new Error(`Could not find an employee similar to "${extractedName}" in the database.`);
        }

        const employeeId = matchedEmployees[0].id;
        console.log(`Matched extracted name "${extractedName}" to DB Employee ID: ${employeeId} (Name: ${matchedEmployees[0].name})`);

      
        const realData = {
            employee_id: employeeId,
            manager_id: manager_id || null,
            metric_scores: feedbackData.metrics,
            text_summary: feedbackData.summary,
        };

        const { data, error } = await supabase
            .from('Reports')
            .insert([realData])
            .select();

        if (error) {
            throw error;
        }

        return {
            savedReport: data,
            detected_language: detectedLanguage
        };
        
    } catch (error) {
        throw error;
    }
};