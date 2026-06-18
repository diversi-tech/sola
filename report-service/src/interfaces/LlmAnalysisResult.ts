export interface LlmAnalysisResult {
    metric_scores: Record<string, number | null>;
    text_summary: string;
    employee_name: string | null;
}

export interface ILlmProvider {
    analyzeFeedback(text: string, categories: string[]): Promise<LlmAnalysisResult>;
}