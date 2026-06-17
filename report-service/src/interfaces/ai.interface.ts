export interface AiAnalysisResult {
    metric_scores: Record<string, number | null>;
    text_summary: string;
    employee_name: string | null;
}

export interface IAiProvider {
    analyzeFeedback(text: string, categories: string[]): Promise<AiAnalysisResult>;
}