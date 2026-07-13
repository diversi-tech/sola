import { supabase } from '../config/supabase.config';
import { WhatsAppMessageRow, FinishStatus } from '../types/db.types';

export const insertIncomingMessage = async (messageData: WhatsAppMessageRow) => {
    try {
        const { data, error } = await supabase
            .from('whatsapp_messages')
            .insert([messageData])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error: any) {
        console.error("[Database Error] Failed to insert incoming message:", error.message);
        return null;
    }
};

export const updateMessageStatus = async (
    whatsappMessageId: string,
    updateData: {
        handling_finish_status?: FinishStatus;
        bot_final_response_text?: string;
        internal_error_log?: string | null;
        received_text_content?: string | null;
    }
) => {
    try {
        const { data, error } = await supabase
            .from('whatsapp_messages')
            .update(updateData)
            .eq('whatsapp_message_id', whatsappMessageId);

        if (error) throw error;
        return data;
    } catch (error: any) {
        console.error(`[Database Error] Failed to update message ${whatsappMessageId}:`, error.message);
        return null;
    }
};