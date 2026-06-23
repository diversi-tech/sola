export interface LLMAnalysisResult {
    metric_scores: Record<string, number | null>;
    text_summary: string;
    employee_name: string | null;
}

export interface ILLMProvider {
    analyzeFeedback(text: string, categories: string[], employeeNames: string[]): Promise<LLMAnalysisResult>;
}