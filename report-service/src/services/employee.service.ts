import { supabase } from '../config/supabase.js';
import { openai } from '../ai/test-ai.js';

// Sara did
export const buildAiConfiguration = (text: string, categories: string[]) => {
    const categoriesString = categories.join(", ");

    const systemPrompt = `You are a strict and analytical HR analyst. Your task is to analyze raw employee feedback text.
  Rate ONLY the metrics explicitly mentioned or strongly implied in the text from the following list: ${categoriesString}.
  If a metric is not relevant to the text, you MUST return null for its score.
  Additionally, write a brief, one-sentence text summary of the employee's feedback.
  Finally, extract the full name of the employee mentioned in the feedback text.`;

    const dynamicMetricProperties: Record<string, any> = {};
    categories.forEach(category => {
        dynamicMetricProperties[category] = {
            type: ["number", "null"] as any,
            description: "Score from 1 to 10, or null if not mentioned in the text"
        };
    });

    return {
        model: "gpt-4o-mini",
        messages: [
            { role: "system" as const, content: systemPrompt },
            { role: "user" as const, content: text }
        ],
        response_format: {
            type: "json_schema" as const,
            json_schema: {
                name: "employee_evaluation",
                strict: true,
                schema: {
                    type: "object",
                    properties: {
                        metric_scores: {
                            type: "object",
                            properties: dynamicMetricProperties,
                            required: categories,
                            additionalProperties: false
                        },
                        text_summary: {
                            type: "string",
                            description: "A short summary of the feedback"
                        },
                        // הנה התוספת שלנו! מבקשים מ-OpenAI את השם
                        employee_name: {
                            type: ["string", "null"] as any,
                            description: "The full name of the employee mentioned in the text, or null if no name is found."
                        }
                    },
                    // הוספנו את השם לכאן כדי שהוא יהיה חייב להחזיר אותו
                    required: ["metric_scores", "text_summary", "employee_name"],
                    additionalProperties: false
                }
            }
        }
    };
};

// Gili did
export const extractEmployeeMetrics = async (text: string) => {
    try {
        const { data: categoriesData, error } = await supabase
            .from('ReportCategory')
            .select('name');

        if (error) {
            console.error("🚨 Supabase Error Details:", error);
            throw new Error("Failed to fetch categories from database");
        }

        const categoryNames = categoriesData.map(c => c.name);
        const aiConfig = buildAiConfiguration(text, categoryNames);
        const response = await openai.chat.completions.create(aiConfig);
        const contentString = response.choices[0].message.content;

        if (!contentString) {
            throw new Error("No content returned from OpenAI");
        }

        return JSON.parse(contentString);

    } catch (error) {
        console.error("Error extracting metrics:", error);
        throw error;
    }
};

export const processAndSaveReport = async (manager_id: number, text: string) => {
    try {
        // 1. קבלת כל הנתונים מה-AI (כולל השם שחילצנו!)
        const llmMetrics = await extractEmployeeMetrics(text);
        const extractedName = llmMetrics.employee_name;

        if (!extractedName) {
            throw new Error("The AI could not identify an employee name in the text.");
        }

        // 2. חיפוש העובד בטבלת Employees לפי השם שה-AI חילץ
        const { data: employeeData, error: employeeError } = await supabase
            .from('Employees')
            .select('id')
            .eq('name', extractedName) // מוצא מישהו שהשם שלו שווה לשם שחולץ
            .single(); // מבקש מהמסד להחזיר רק תוצאה אחת מדויקת

        // אם יש שגיאה בחיפוש או שהעובד פשוט לא קיים בטבלה
        if (employeeError || !employeeData) {
            throw new Error(`Employee named '${extractedName}' was not found in the database.`);
        }

        // 3. בניית הנתונים לשמירה עם ה-ID האמיתי שמצאנו!
        const realData = {
            employee_id: employeeData.id, // <--- הקסם קורה פה! דינמי לחלוטין
            manager_id: manager_id || 2,
            metric_scores: llmMetrics.metric_scores,
            text_summary: llmMetrics.text_summary
        };

        // 4. שמירת הדיווח הסופי בטבלת Reports
        const { data, error } = await supabase
            .from('Reports')
            .insert([realData])
            .select();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error in processAndSaveReport:", error);
        throw error;
    }
};