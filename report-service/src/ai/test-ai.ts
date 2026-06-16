import 'dotenv/config'; 
import OpenAI from 'openai';

// יצירת החיבור וייצוא שלו לשאר חלקי המערכת
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
    baseURL: "https://models.inference.ai.azure.com" 
});