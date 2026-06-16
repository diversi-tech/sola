import { verifyUserAuth } from './auth.services';
import { downloadAudioFile } from './media.services';
import { sendToReports } from './reports.service'; 
import { ReportIncomingData } from '../types/reports.types';

const WHATSAPP_BUSINESS = 'whatsapp_business_account';

export const processWebhookEvent = async (body: any) => {
    console.log(': Received webhook event in service:', JSON.stringify(body, null, 2));

    if (body.object === WHATSAPP_BUSINESS) {
        const messages = body.entry?.[0]?.changes?.[0]?.value?.messages;

        if (messages?.length) {
            const message = messages[0];
            const senderPhoneNumber = message.from;

            if (typeof senderPhoneNumber === 'string' && senderPhoneNumber.trim() !== '') {
                // 1. אימות המשתמש
                const authResult = await verifyUserAuth({ "phoneNumber": senderPhoneNumber });
                
                if (!authResult.isAuthorized) {
                    console.error("Unauthorized User! Stopping process.");
                    return;
                }

                console.log(`User is authorized! Real UserID is: ${authResult.userId}`);
                const messageType = message.type;

                // 2. ניתוב לפי סוג הודעה
                if (messageType === 'text') {
                    console.log("Message type is text.");
                    const reportData: ReportIncomingData = {
                        userId: authResult.userId, 
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
                        if (filePath) {
                            console.log("Audio file downloaded successfully for further processing.");
                        }
                    }
                } else {
                    console.log(`Unknown message type received: ${messageType}`);
                }
            } else {
                console.error("Validation failed: Phone number is missing or invalid");
            }
        }
    }
};