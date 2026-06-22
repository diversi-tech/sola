import { verifyUserAuth } from './auth.services';
import { downloadAudioFile } from './media.services';
import { sendToReports } from './reports.service';
import { transcribeAudioFile } from './speech-to-text.service';
import { ReportIncomingData } from '../types/reports.types';
import axios from 'axios';
import fs from 'fs';

const WHATSAPP_BUSINESS = 'whatsapp_business_account';

export const sendWhatsAppMessage = async (to: string, text: string) => {
    try {
        const token = process.env.META_ACCESS_TOKEN;
        const phone_number_id = process.env.META_PHONE_NUMBER_ID;
        const whatsappUrl = `${process.env.META_API_BASE_URL}/${phone_number_id}/messages`;
        
        await axios.post(
            whatsappUrl,
            {
                messaging_product: "whatsapp",
                to: to,
                text: { body: text },
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        console.log(`Message sent successfully to ${to}`);
    } catch (error) {
        console.error("Failed to send WhatsApp message:", error);
    }
};

export const checkVerifyToken = (mode: string, token: string): boolean => {
    return mode === 'subscribe' && token === process.env.VERIFY_TOKEN;
};

const handleTextMessage = async (userId: string, message: any, senderPhoneNumber: string) => {
    console.log("Message type is text.");
    const reportData: ReportIncomingData = {
        userId: userId,
        content: message.text?.body || '',
        messageId: message.id,
        timestamp: String(message.timestamp)
    };

    const isSuccess = await sendToReports(reportData);
    if (isSuccess) {
        await sendWhatsAppMessage(senderPhoneNumber, "הדיווח התקבל בהצלחה! תודה שעדכנת.");
    } else {
        await sendWhatsAppMessage(senderPhoneNumber, "מצטערים, חלה שגיאה בעיבוד הדיווח. אנא נסה שוב.");
    }
};

const handleAudioMessage = async (userId: string, message: any, senderPhoneNumber: string) => {
    console.log("Message type is audio. Starting media download...");
    const mediaId = message.audio?.id;

    if (!mediaId) {
        console.error("Audio message received but no media ID found.");
        return;
    }

    const filePath = await downloadAudioFile(mediaId);

    if (!filePath) {
        await sendWhatsAppMessage(senderPhoneNumber, "מצטערים, לא הצלחנו להוריד את קובץ האודיו.");
        return;
    }

    const transcribedText = await transcribeAudioFile(filePath);

    try {
        fs.unlinkSync(filePath);
        console.log(`[Cleanup] Temporary file deleted: ${filePath}`);
    } catch (cleanupError) {
        console.error(`[Cleanup] Failed to delete file: ${filePath}`, cleanupError);
    }

    if (!transcribedText) {
        await sendWhatsAppMessage(senderPhoneNumber, "מצטערים, לא הצלחנו לתמלל את האודיו שלך.");
        return;
    }

    const reportData: ReportIncomingData = {
        userId: userId,
        content: transcribedText,
        messageId: message.id,
        timestamp: String(message.timestamp)
    };

    const isSuccess = await sendToReports(reportData);
    if (isSuccess) {
        await sendWhatsAppMessage(senderPhoneNumber, "הדיווח הקולי התקבל וטופל בהצלחה!");
    } else {
        await sendWhatsAppMessage(senderPhoneNumber, "הדיווח הקולי הגיע, אך חלה שגיאה בשמירתו במערכת.");
    }
};

export const processWebhookEvent = async (body: any): Promise<{ isAuthorized: boolean; phoneNumber?: string } | null> => {
    console.log('Webhook event received from Meta');

    if (body.object === WHATSAPP_BUSINESS) {
        const messages = body.entry?.[0]?.changes?.[0]?.value?.messages;

        if (messages?.length) {
            const message = messages[0];
            const senderPhoneNumber = message.from;

            if (typeof senderPhoneNumber === 'string' && senderPhoneNumber.trim() !== '') {
                let authResult;
                const authPayload = { "phoneNumber": senderPhoneNumber };

                if (process.env.USE_MOCK_AUTH === 'true') {
                    authResult = { isAuthorized: true, userId: "mock_user_123", message: "Dev bypass" };
                } else {
                    authResult = await verifyUserAuth(authPayload);
                }

                if (!authResult.isAuthorized) {
                    console.error("Unauthorized User! Stopping process.");
                    return { isAuthorized: false, phoneNumber: senderPhoneNumber };
                }

                const userId = authResult.userId;
                const messageType = message.type;

                if (messageType === 'text') {
                    await handleTextMessage(userId, message, senderPhoneNumber);
                } else if (messageType === 'audio') {
                    await handleAudioMessage(userId, message, senderPhoneNumber);
                } else {
                    console.log(`Unknown message type received: ${messageType}`);
                }

                return { isAuthorized: true, phoneNumber: senderPhoneNumber };
            }
        }
    }
    return null;

};