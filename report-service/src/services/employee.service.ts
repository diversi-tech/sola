import { supabase } from '../config/supabase.js';
import { openai } from '../ai/test-ai.js';

//Sara did
export const buildAiConfiguration = (text: string, categories: string[]) => {
    const categoriesString = categories.join(", ");

    const systemPrompt = `You are a strict and analytical HR analyst. Your task is to analyze raw employee feedback text.
  Rate ONLY the metrics explicitly mentioned or strongly implied in the text from the following list: ${categoriesString}.
  If a metric is not relevant to the text, you MUST return null for its score.
  Additionally, write a brief, one-sentence text summary of the employee's feedback.`;

    const dynamicMetricProperties: Record<string, any> = {};
    categories.forEach(category => {
        dynamicMetricProperties[category] = {
            type: ["number", "null"],
            description: "Score from 1 to 10, or null if not mentioned in the text"
        };
    });

    return {
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text }
        ],
        response_format: {
            type: "json_schema",
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
                        }
                    },
                    required: ["metric_scores", "text_summary"],
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
        const llmMetrics = await extractEmployeeMetrics(text);

        const realData = {
            employee_id: 1,
            manager_id: manager_id || 2,
            metric_scores: llmMetrics.metric_scores,
            text_summary: llmMetrics.text_summary
        };

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