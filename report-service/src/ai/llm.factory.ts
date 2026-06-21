import { ILLMProvider } from '../interfaces/LlmAnalysisResult.js';
import { GeminiProvider } from './gemini.provider.js';
import fs from 'fs';
import path from 'path';

export class LLMFactory {
    

    public static getProvider(): ILLMProvider {
        try {
            const configPath = path.join(process.cwd(), 'src', 'config', 'llm', 'llm.current.json');      
            const configRaw = fs.readFileSync(configPath, 'utf-8');
            const config = JSON.parse(configRaw);

            switch (config.provider) {
                case 'gemini':
                    return new GeminiProvider();
                
                // case 'openai':
                 //    return new OpenAiProvider(); 
                
                default:
                    console.warn(`[LlmFactory] Unknown provider '${config.provider}', falling back to Gemini.`);
                    return new GeminiProvider();
            }
        } catch (error) {
            console.error("[LlmFactory] Failed to load provider from config. Falling back to Gemini.", error);
            return new GeminiProvider();
        }
    }
}