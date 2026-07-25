import 'dotenv/config';
import OpenAI from 'openai';

let client: OpenAI | null = null;
export function getOpenAiClient(): OpenAI {
    if (!client) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error(
                'OPENAI_API_KEY is not set. It is required because OpenAI is the selected LLM provider (see src/config/llm/llm.current.json).'
            );
        }
        client = new OpenAI({ apiKey });
    }
    return client;
}
