import 'dotenv/config'; 
import OpenAI from 'openai';

// חיבור לשרת הענן החינמי של GitHub
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
  baseURL: "https://models.inference.ai.azure.com" // השרת החינמי של גיטהאב (פתוח בנטפרי!)
});

async function testGithubConnection() {
  console.log("🔋 מנסה להתחבר ל-GPT-4o-mini החינמי של GitHub...");
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // המודל המדויק מהמשימה שלך!
      messages: [{ role: "user", content: "Say 'Hello World from GitHub Models'" }],
      max_tokens: 10,
    });

    console.log("✅ החיבור הצליח באופן מאובטח דרך הענן!");
    console.log("תשובת המודל:", response.choices[0].message.content);
  } catch (error: any) {
    console.error("❌ שגיאה בחיבור:", error.message);
  }
}

testGithubConnection();