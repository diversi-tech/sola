import { baseLLMProvider } from './base-llm.provider.js';
import { genAI } from './gemini.client.js';
import { Schema } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

export class GeminiProvider extends baseLLMProvider {
    
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
            
            const specificConfigRaw = fs.readFileSync(path.join(configDir, `gemini.${currentConfig.active}.json`), 'utf-8');
            const specificConfig = JSON.parse(specificConfigRaw);

            this.modelName = specificConfig.modelName;
            this.temperature = specificConfig.temperature;
            
            console.log(`[LLM Config] Loaded model: ${this.modelName} (Temperature: ${this.temperature})`);
        } catch (error) {
            console.error("Failed to load LLM configuration files.", error);
            throw error;
        }
    }

    protected async callLlmApi(prompt: string, schema: any): Promise<string> {
        const model = genAI.getGenerativeModel({
            model: this.modelName,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema as Schema,
                temperature: this.temperature
            }
        });

        const result = await model.generateContent(prompt);
        const contentString = result.response.text();
        
        if (!contentString) {
            throw new Error("No content returned from Gemini");
        }

        return contentString;
    }
}