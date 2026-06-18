import { LlmAnalysisResult } from '../interfaces/LlmAnalysisResult.js'; 
import { SchemaType, Schema } from '@google/generative-ai';
import { logLLMRun } from '../utils/logLlmRun.js'; 
import fs from 'fs';
import path from 'path';

export abstract class baseLLMProvider {
    
    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    protected buildPrompt(text: string, categories: string[]): string {
        const categoriesString = categories.join(", ");
        
        const promptPath = path.join(process.cwd(), 'src', 'config', 'llm', 'system-prompt.txt');
        
        let promptTemplate = fs.readFileSync(promptPath, 'utf-8');
        
        promptTemplate = promptTemplate.replace('{{CATEGORIES}}', categoriesString);
        promptTemplate = promptTemplate.replace('{{USER_TEXT}}', text);
        
        return promptTemplate;
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

    protected abstract callLlmApi(prompt: string, schema: any): Promise<string>;

    public async analyzeFeedback(text: string, categories: string[]): Promise<LlmAnalysisResult> {
        const prompt = this.buildPrompt(text, categories);
        const schema = this.buildSchema(categories);
        const modelName = this.getProviderName(); 
        
        const maxRetries = 3; 
        let attempt = 0;

        while (attempt < maxRetries) {
            try {
                const rawResponse = await this.callLlmApi(prompt, schema);
                
                logLLMRun('SUCCESS', `Model: ${modelName} | Analyzed feedback successfully on attempt ${attempt + 1}.`);
                
                return JSON.parse(rawResponse);
                
            } catch (error: any) {
                attempt++;
                
                if (error.status === 503 && attempt < maxRetries) {
                    logLLMRun('WARNING', `Model: ${modelName} | Attempt ${attempt} failed (503 Busy). Retrying...`);
                    await this.delay(2000); 
                } else {
                    logLLMRun('ERROR', `Model: ${modelName} | Failed completely after ${attempt} attempts. Error: ${error.message || 'Unknown Error'}`);
                    throw error;
                }
            }
        }
        
        throw new Error("Failed to analyze feedback after multiple attempts.");
    }
}