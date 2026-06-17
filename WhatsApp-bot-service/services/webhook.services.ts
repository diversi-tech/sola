import { verifyUserAuth } from './auth.services';
import { downloadAudioFile } from './media.services';
import { sendToReports } from './reports.service'; 
import { transcribeAudioFile } from './stt.service'; 
import { ReportIncomingData } from '../types/reports.types';
import axios from 'axios';

const WHATSAPP_BUSINESS = 'whatsapp_business_account';

export const sendWhatsAppMessage = async (to: string, text: string) => {
    try {
        const token = process.env.WHATSAPP_TOKEN;
        const phone_number_id = process.env.PHONE_NUMBER_ID; //our WhatsApp Business Account phone number ID

        await axios.post(
            `https://graph.facebook.com/v17.0/${phone_number_id}/messages`,
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
    const verification_token = process.env.VERIFY_TOKEN;
    return mode === 'subscribe' && token === verification_token;
};

export const processWebhookEvent = async (body: any): Promise<{ isAuthorized: boolean; phoneNumber?: string } | null> => {
    console.log(': Received webhook event in service:', JSON.stringify(body, null, 2));

    if (body.object === WHATSAPP_BUSINESS) {
        const messages = body.entry?.[0]?.changes?.[0]?.value?.messages;

        if (messages?.length) {
            const message = messages[0];
            const senderPhoneNumber = message.from;

            if (typeof senderPhoneNumber === 'string' && senderPhoneNumber.trim() !== '') {
              
                let authResult;
                const authPayload = { "phoneNumber": senderPhoneNumber };

                if (process.env.USE_MOCK_AUTH === 'true') {
                    console.log(" DEV MODE: Bypassing Auth Service.");
                    authResult = { isAuthorized: true, userId: "mock_user_123", message: "Dev bypass" };
                } 
                else {
                    authResult = await verifyUserAuth(authPayload);
                }
                
                if (!authResult.isAuthorized) {
                    console.error("Unauthorized User! Stopping process. Message:", authResult.message);
                    return { isAuthorized: false, phoneNumber: senderPhoneNumber }; 
                }

                const userId = authResult.userId; 
                console.log("User Authorized");
                console.log(`Real UserID is: ${userId}`);

                const messageType = message.type;
                
                
                if (messageType === 'text') {
                    console.log("Message type is text.");
                    const reportData: ReportIncomingData = {
                        userId: userId, 
                        content: message.text?.body || '',
                        messageId: message.id,
                        timestamp: String(message.timestamp)
                    };
                    await sendToReports(reportData);
                } 
                
                else if (messageType === 'audio') {
                    console.log("Message type is audio. Switching to Task 57 (Media Download).");
                    const mediaId = message.audio?.id;
                    
                    if (mediaId) {
                      
                        const filePath = await downloadAudioFile(mediaId);
                        
                        if (!filePath) {
                            console.error("Audio download failed, stopping processing.");
                            return { isAuthorized: true, phoneNumber: senderPhoneNumber }; 
                        }
                        
                        console.log("Audio file downloaded successfully for further processing.");

                        
                        const transcribedText = await transcribeAudioFile(filePath);

                        if (!transcribedText) {
                            console.error("STT transcription failed, stopping processing.");
                            return { isAuthorized: true, phoneNumber: senderPhoneNumber };
                        }

                        console.log("STT transcription completed successfully!");

                      
                        const reportData: ReportIncomingData = {
                            userId: userId, 
                            content: transcribedText, 
                            messageId: message.id,
                            timestamp: String(message.timestamp)
                        };
                        
                        
                        await sendToReports(reportData);
                        console.log("[Webhook] Audio transcription chain finalized and report sent successfully! (Task 56 Complete)");
                        
                    } else {
                        console.error("Audio message received but no media ID found.");
                    }
                } else {
                    console.log(`Unknown message type received: ${messageType}`);
                }
                
                return { isAuthorized: true, phoneNumber: senderPhoneNumber };
            } else {
                console.error("Validation failed: Phone number is missing or invalid");
            }
        }
    }
    return null;
};