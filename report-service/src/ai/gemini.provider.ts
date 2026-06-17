import { BaseAiProvider } from './base-ai.provider.js';
import { genAI } from './gemini.client.js';
import fs from 'fs';
import path from 'path';

export class GeminiProvider extends BaseAiProvider {
    
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
            const configDir = path.join(process.cwd(), 'src', 'config', 'ai');
            
            const currentConfigRaw = fs.readFileSync(path.join(configDir, 'ai.current.json'), 'utf-8');
            const currentConfig = JSON.parse(currentConfigRaw);
            
            const specificConfigRaw = fs.readFileSync(path.join(configDir, `gemini.${currentConfig.active}.json`), 'utf-8');
            const specificConfig = JSON.parse(specificConfigRaw);

            this.modelName = specificConfig.modelName;
            this.temperature = specificConfig.temperature;
            
            console.log(`[AI Config] Loaded model: ${this.modelName} (Temperature: ${this.temperature})`);
        } catch (error) {
            console.error("Failed to load AI configuration files.", error);
            throw error;
        }
    }

    protected async callAiApi(prompt: string, schema: any): Promise<string> {
        const model = genAI.getGenerativeModel({
            model: this.modelName,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
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