import { AiAnalysisResult } from '../interfaces/ai.interface.js';
import { SchemaType, Schema } from '@google/generative-ai';
import { logAiRun } from '../utils/logger.js'; 
export abstract class BaseAiProvider {
    
    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    protected buildPrompt(text: string, categories: string[]): string {
        const categoriesString = categories.join(", ");
        return `You are a strict and analytical HR analyst. Your task is to analyze raw employee feedback text.
 Rate ONLY the metrics explicitly mentioned or strongly implied in the text from the following list: ${categoriesString}.
 IMPORTANT: All metric scores MUST be integers on a scale from 1 to 10 (where 1 is lowest and 10 is highest).
 If a metric is not relevant to the text, you MUST return null for its score.
 Additionally, write a brief, one-sentence text summary of the employee's feedback IN ENGLISH.
 Finally, extract the full name of the employee mentioned in the feedback text. 
 IMPORTANT: Extract the name exactly as it is written in the text. If the name is in Hebrew, translate or transliterate it to English.

 Feedback text to analyze:
 "${text}"`;
    }

    protected buildSchema(categories: string[]): Schema {
        const dynamicMetricProperties: Record<string, Schema> = {};
        categories.forEach(category => {
            dynamicMetricProperties[category] = { type: SchemaType.INTEGER, nullable: true };
        });
        return {
            type: SchemaType.OBJECT,
            properties: {
                metric_scores: { type: SchemaType.OBJECT, properties: dynamicMetricProperties, required: categories },
                text_summary: { type: SchemaType.STRING },
                employee_name: { type: SchemaType.STRING, nullable: true }
            },
            required: ["metric_scores", "text_summary", "employee_name"],
        } as Schema;
    }

    protected abstract getProviderName(): string;

    protected abstract callAiApi(prompt: string, schema: any): Promise<string>;

    public async analyzeFeedback(text: string, categories: string[]): Promise<AiAnalysisResult> {
        const prompt = this.buildPrompt(text, categories);
        const schema = this.buildSchema(categories);
        const modelName = this.getProviderName(); 
        
        const maxRetries = 3; 
        let attempt = 0;

        while (attempt < maxRetries) {
            try {
                const rawResponse = await this.callAiApi(prompt, schema);
                
                logAiRun('SUCCESS', `Model: ${modelName} | Analyzed feedback successfully on attempt ${attempt + 1}.`);
                
                return JSON.parse(rawResponse);
                
            } catch (error: any) {
                attempt++;
                
                if (error.status === 503 && attempt < maxRetries) {
                    logAiRun('WARNING', `Model: ${modelName} | Attempt ${attempt} failed (503 Busy). Retrying...`);
                    await this.delay(2000); 
                } else {
                    logAiRun('ERROR', `Model: ${modelName} | Failed completely after ${attempt} attempts. Error: ${error.message || 'Unknown Error'}`);
                    throw error;
                }
            }
        }
        
        throw new Error("Failed to analyze feedback after multiple attempts.");
    }
}