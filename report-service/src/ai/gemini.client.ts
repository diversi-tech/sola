import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

let client: GoogleGenerativeAI | null = null;
export function getGenAiClient(): GoogleGenerativeAI {
    if (!client) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error(
                'GEMINI_API_KEY is not set. It is required because Gemini is the selected LLM provider (see src/config/llm/llm.current.json).'
            );
        }
        client = new GoogleGenerativeAI(apiKey);
    }
    return client;
}
