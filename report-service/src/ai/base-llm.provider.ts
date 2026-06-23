import { LLMAnalysisResult } from '../interfaces/LlmAnalysisResult.js';
import { logLLMRun } from '../utils/logLlmRun.js';
import fs from 'fs';
import path from 'path';

export abstract class baseLLMProvider {

    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    protected buildPrompt(text: string, categories: string[], employeeNames: string[]): string {
        const categoriesString = categories.join(", ");

        const employeeNamesString = employeeNames.join(", ");

        const promptPath = path.join(process.cwd(), 'src', 'config', 'llm', 'system-prompt.txt');

        let promptTemplate = fs.readFileSync(promptPath, 'utf-8');

        promptTemplate = promptTemplate.replace('{{CATEGORIES}}', categoriesString);
        promptTemplate = promptTemplate.replace('{{USER_TEXT}}', text);
        promptTemplate = promptTemplate.replace('{{EMPLOYEE_NAMES}}', employeeNamesString);

        return promptTemplate;
    }

    protected buildSchema(categories: string[],employeeNames: string[]): any {
        const dynamicMetricProperties: Record<string, any> = {};
        categories.forEach(category => {
            dynamicMetricProperties[category] = { type: "integer", nullable: true };
        });

        return {
            type: "object",
            properties: {
                metric_scores: { type: "object", properties: dynamicMetricProperties, required: categories },
                text_summary: { type: "string" },
                employee_name: { type: "string", enum: employeeNames, nullable: true }
            },
            required: ["metric_scores", "text_summary", "employee_name"],
        };
    }

    protected abstract getProviderName(): string;

    protected abstract callLlmApi(prompt: string, schema: any): Promise<string>;

    public async analyzeFeedback(text: string, categories: string[], employeeNames: string[] ): Promise<LLMAnalysisResult> {
        const prompt = this.buildPrompt(text, categories,employeeNames);
        const schema = this.buildSchema(categories,employeeNames);
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