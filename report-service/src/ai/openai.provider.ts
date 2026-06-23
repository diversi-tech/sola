import { baseLLMProvider } from './base-llm.provider.js';
import { openaiClient } from './openai.client.js';
import fs from 'fs';
import path from 'path';

export class OpenAiProvider extends baseLLMProvider {
    private modelName!: string;
    private temperature!: number;

    constructor() {
        super();
        this.loadConfiguration(); 
    }

    protected getProviderName(): string {
        return this.modelName; 
    }

    private loadConfiguration() {
        try {
            const configDir = path.join(process.cwd(), 'src', 'config', 'llm');
            
            const currentConfigRaw = fs.readFileSync(path.join(configDir, 'llm.current.json'), 'utf-8');
            const currentConfig = JSON.parse(currentConfigRaw);
            
            const specificConfigRaw = fs.readFileSync(path.join(configDir, `openai.${currentConfig.active}.json`), 'utf-8');
            const specificConfig = JSON.parse(specificConfigRaw);

            this.modelName = specificConfig.modelName || specificConfig.model;
            this.temperature = specificConfig.temperature;
            
            console.log(`[LLM Config] Loaded OpenAI model: ${this.modelName} (Temperature: ${this.temperature})`);
        } catch (error) {
            console.error("Failed to load OpenAI configuration files.", error);
            throw error;
        }
    }

    protected async callLlmApi(prompt: string, schema: any): Promise<string> {
        const response = await openaiClient.chat.completions.create({
            model: this.modelName,
            temperature: this.temperature,
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `You are a helpful assistant. Please return your response in strictly valid JSON format matching this schema: ${JSON.stringify(schema)}`
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        const contentString = response.choices[0]?.message?.content;
        
        if (!contentString) {
            throw new Error("No content returned from OpenAI");
        }

        return contentString;
    }
}