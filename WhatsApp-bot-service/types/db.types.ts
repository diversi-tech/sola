export type IncomingFormat = 'text' | 'audio';
export type FinishStatus = 'PENDING' | 'SUCCESS' | 'FAILED'|'SYSTEM_ERROR';

export interface WhatsAppMessageRow {
    id?: string; 
    whatsapp_message_id: string;
    employee_phone_number: string;
    incoming_message_format: IncomingFormat;
    received_text_content?: string | null;
    uploaded_audio_url?: string | null;
    handling_finish_status?: FinishStatus;
    bot_final_response_text?: string | null;
    internal_error_log?: string | null;
    received_at?: string;
}