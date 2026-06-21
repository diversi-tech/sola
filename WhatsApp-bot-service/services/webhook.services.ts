import { verifyUserAuth } from './auth.services';
import { downloadAudioFile } from './media.services';
import { sendToReports } from './reports.service'; 
import { transcribeAudioFile } from './stt.service'; 
import { ReportIncomingData } from '../types/reports.types';
import axios from 'axios';
import fs from 'fs';

const WHATSAPP_BUSINESS = 'whatsapp_business_account';
const WHATSAPP_API_BASE_URL = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v17.0';

const handleTextMessage = async (userId: string, message: any) => {
    const reportData: ReportIncomingData = {
        userId,
        content: message.text?.body || '',
        messageId: message.id,
        timestamp: String(message.timestamp)
    };
    await sendToReports(reportData);
};

const handleAudioMessage = async (userId: string, message: any) => {
    const mediaId = message.audio?.id;
    if (!mediaId) return console.error("No media ID found in audio message.");

    const filePath = await downloadAudioFile(mediaId);
    if (!filePath) return console.error("Audio download failed.");

    const transcribedText = await transcribeAudioFile(filePath);
    
    try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) { console.error("Cleanup failed", e); }

    if (!transcribedText) return console.error("Transcription failed.");

    await sendToReports({
        userId,
        content: transcribedText,
        messageId: message.id,
        timestamp: String(message.timestamp)
    });
};

export const sendWhatsAppMessage = async (to: string, text: string) => {
    try {
        const token = process.env.META_ACCESS_TOKEN;
        const phone_number_id = process.env.META_PHONE_NUMBER_ID;
        const whatsapp_url = `${WHATSAPP_API_BASE_URL}/${phone_number_id}/messages`;

        await axios.post(whatsapp_url, {
            messaging_product: "whatsapp",
            to,
            text: { body: text },
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`Message sent successfully to ${to}`);
    } catch (error) {
        console.error("Failed to send WhatsApp message:", error);
    }
};

export const checkVerifyToken = (mode: string, token: string): boolean => {
    return mode === 'subscribe' && token === process.env.VERIFY_TOKEN;
};

export const processWebhookEvent = async (body: any): Promise<{ isAuthorized: boolean; phoneNumber?: string } | null> => {
    if (body.object !== WHATSAPP_BUSINESS) return null;
    
    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message) return null;

    const senderPhoneNumber = message.from;
    
    const authResult = process.env.USE_MOCK_AUTH === 'true' 
        ? { isAuthorized: true, userId: "mock_user_123" } 
        : await verifyUserAuth({ phoneNumber: senderPhoneNumber });

    if (!authResult.isAuthorized) return { isAuthorized: false, phoneNumber: senderPhoneNumber };

    if (message.type === 'text') await handleTextMessage(authResult.userId, message);
    else if (message.type === 'audio') await handleAudioMessage(authResult.userId, message);
    else console.log(`Unknown message type: ${message.type}`);

    return { isAuthorized: true, phoneNumber: senderPhoneNumber };
};