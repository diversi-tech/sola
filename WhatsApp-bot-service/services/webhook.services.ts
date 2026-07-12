import { verifyUserAuth } from './auth.services';
import { downloadAudioFile } from './media.services';
import { sendToReports } from './reports.service';
import { transcribeAudioFile } from './speech-to-text.service';
import { ReportIncomingData } from '../types/reports.types';
import { translateForUser } from './translator.service'; 
import { insertIncomingMessage, updateMessageStatus } from './database.service';
import axios from 'axios';
import fs from 'fs';

const WHATSAPP_BUSINESS = 'whatsapp_business_account';
 const DEFAULT_META_API_URL = 'https://graph.facebook.com/v18.0';

export const sendWhatsAppMessage = async (to: string, text: string) => {
    try {
        const token = process.env.META_ACCESS_TOKEN;
        const phone_number_id = process.env.META_PHONE_NUMBER_ID;
        
        const baseUrl = process.env.META_API_BASE_URL || DEFAULT_META_API_URL;
        const whatsappUrl = `${baseUrl}/${phone_number_id}/messages`;
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
    const textContent = message.text?.body || '';

    await insertIncomingMessage({
        whatsapp_message_id: message.id,
        employee_phone_number: senderPhoneNumber,
        incoming_message_format: 'text',
        received_text_content: textContent,
        handling_finish_status: 'PENDING'
    });

    const reportData: ReportIncomingData = {
        manager_id: userId,
        text: textContent,
        messageId: message.id,
        timestamp: String(message.timestamp)
    };

    let finalResponse = "";
    try {
        const reportsResponse: any = await sendToReports(reportData); 
        
        if (reportsResponse && reportsResponse.message) {
            finalResponse = await translateForUser(reportsResponse.message, reportsResponse.detected_language);
            await sendWhatsAppMessage(senderPhoneNumber, finalResponse);
            
            await updateMessageStatus(message.id, {
                handling_finish_status: 'SUCCESS',
                bot_final_response_text: finalResponse
            });
        } else if (reportsResponse) {
            finalResponse = "The report was received successfully! Thank you for the update";
            await sendWhatsAppMessage(senderPhoneNumber, finalResponse);
            
            await updateMessageStatus(message.id, {
                handling_finish_status: 'SUCCESS',
                bot_final_response_text: finalResponse
            });
        } else {
            finalResponse = "Sorry, an error occurred while processing the report. Please try again.";
            await sendWhatsAppMessage(senderPhoneNumber, finalResponse);
            
            await updateMessageStatus(message.id, {
                handling_finish_status: 'FAILED',
                bot_final_response_text: finalResponse,
                internal_error_log: "Reports service returned empty or null response"
            });
        }
    } catch (error: any) {
        finalResponse = "Sorry, an error occurred while processing the report. Please try again.";
        await sendWhatsAppMessage(senderPhoneNumber, finalResponse);
        
        await updateMessageStatus(message.id, {
            handling_finish_status: 'FAILED',
            bot_final_response_text: finalResponse,
            internal_error_log: error.message
        });
    }
};

const handleAudioMessage = async (userId: string, message: any, senderPhoneNumber: string) => {
    console.log("Message type is audio. Starting media download...");
    const mediaId = message.audio?.id;

    await insertIncomingMessage({
        whatsapp_message_id: message.id,
        employee_phone_number: senderPhoneNumber,
        incoming_message_format: 'audio',
        handling_finish_status: 'PENDING'
    });

    if (!mediaId) {
        const errLog = "Audio message received but no media ID found.";
        console.error(errLog);
        await updateMessageStatus(message.id, { 
            handling_finish_status: 'FAILED', 
            internal_error_log: errLog 
        });
        return;
    }

    const filePath = await downloadAudioFile(mediaId);

    if (!filePath) {
        const finalResponse = "Sorry, we couldn't download your audio file.";
        await sendWhatsAppMessage(senderPhoneNumber, finalResponse);
        await updateMessageStatus(message.id, {
            handling_finish_status: 'FAILED',
            bot_final_response_text: finalResponse,
            internal_error_log: "Failed to download audio file via mediaService"
        });
        return;
    }

    const transcribedText = await transcribeAudioFile(filePath, userId);

    try {
        fs.unlinkSync(filePath);
        console.log(`[Cleanup] Temporary file deleted: ${filePath}`);
    } catch (cleanupError) {
        console.error(`[Cleanup] Failed to delete file: ${filePath}`, cleanupError);
    }

    if (!transcribedText) {
        const finalResponse = "Sorry, we couldn't transcribe your audio file.";
        await sendWhatsAppMessage(senderPhoneNumber, finalResponse);
        await updateMessageStatus(message.id, {
            handling_finish_status: 'FAILED',
            bot_final_response_text: finalResponse,
            internal_error_log: "STT Service returned empty transcription"
        });
        return;
    }

    await updateMessageStatus(message.id, {
        received_text_content: transcribedText
    });

    const reportData: ReportIncomingData = {
       manager_id: userId,
       text: transcribedText,
       messageId: message.id,
       timestamp: String(message.timestamp)
    };

    let finalResponse = "";
    try {
        const reportsResponse: any = await sendToReports(reportData);
        
        if (reportsResponse && reportsResponse.message) {
            finalResponse = await translateForUser(reportsResponse.message, reportsResponse.detected_language);
            await sendWhatsAppMessage(senderPhoneNumber, finalResponse);
            
            await updateMessageStatus(message.id, {
                handling_finish_status: 'SUCCESS',
                bot_final_response_text: finalResponse
            });
        } else if (reportsResponse) {
            finalResponse = "The voice report was received and processed successfully!";
            await sendWhatsAppMessage(senderPhoneNumber, finalResponse);
            
            await updateMessageStatus(message.id, {
                handling_finish_status: 'SUCCESS',
                bot_final_response_text: finalResponse
            });
        } else {
            finalResponse = "The voice report was received, but an error occurred while saving it to the system.";
            await sendWhatsAppMessage(senderPhoneNumber, finalResponse);
            
            await updateMessageStatus(message.id, {
                handling_finish_status: 'FAILED',
                bot_final_response_text: finalResponse,
                internal_error_log: "Reports service returned null for audio report data"
            });
        }
    } catch (error: any) {
        finalResponse = "The voice report was received, but an error occurred while saving it to the system.";
        await sendWhatsAppMessage(senderPhoneNumber, finalResponse);
        
        await updateMessageStatus(message.id, {
            handling_finish_status: 'FAILED',
            bot_final_response_text: finalResponse,
            internal_error_log: error.message
        });
    }
};
const isCountryCodePrefix = (phoneNumber: string): boolean => {
    return phoneNumber.startsWith('+');
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
                let formattedPhone = senderPhoneNumber;
                if (!isCountryCodePrefix(formattedPhone)) {
                 formattedPhone = `+${formattedPhone}`;
             }

                const authPayload = { "phone_number": formattedPhone };
                if (process.env.USE_MOCK_AUTH === 'true') {
                   const mockUserId = process.env.MOCK_USER_ID || "123e4567-e89b-12d3-a456-426614174000";
                   authResult = { isAuthorized: true, userId: mockUserId, message: "Dev bypass" };
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
