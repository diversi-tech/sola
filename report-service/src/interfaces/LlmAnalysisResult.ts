export interface LLMAnalysisResult {
    detected_language: string;
    employee_feedback: {
        employee_name: string | null;
        summary: string;
        metrics: Record<string, number | null>;
    };
}

export interface ILLMProvider {
    analyzeFeedback(text: string, categories: string[]): Promise<LLMAnalysisResult>;
}