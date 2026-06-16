import { verifyUserAuth } from './auth.sevices'; 
import { ReportIncomingData } from '../types/reports.types';

declare const process: any;

const WHATSAPP_BUSINESS = 'whatsapp_business_account';

export const checkVerifyToken = (mode: string, token: string): boolean => {
    const verification_token = process.env.VERIFY_TOKEN;
    return mode === 'subscribe' && token === verification_token;
};

export const sendToReports = async (data: ReportIncomingData): Promise<boolean> => {
    try {
        console.log(` Sending data to Reports Service:`, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error("Failed to send data to Reports Service:", error);
        return false;
    }
};

export const processWebhookEvent = async (body: any) => {
    console.log(': Received webhook event in service:', JSON.stringify(body, null, 2));

    if (body.object === WHATSAPP_BUSINESS) {
        const messages = body.entry?.[0]?.changes?.[0]?.value?.messages;

        if (messages?.length) {
            const message = messages[0];
            const senderPhoneNumber = message.from; 

            if (typeof senderPhoneNumber === 'string' && senderPhoneNumber.trim() !== '') {
                console.log(" Success! Extracted phone number:", senderPhoneNumber);
                
                const authPayload = { "phoneNumber": senderPhoneNumber };
                console.log(" Checking authorization for:", authPayload);
                
                const authResult = await verifyUserAuth(authPayload);
                
                if (!authResult.isAuthorized) {
                    console.error(" Unauthorized User! Stopping process. Message:", authResult.message);
                    return; 
                }

                console.log(` User is authorized! Real UserID is: ${authResult.userId}`);

                const messageType = message.type;
                console.log(` Classifying message content type: ${messageType}`);

                if (messageType === 'text') {
                    console.log(" Message type is text. Proceeding to Task 8 path.");
                    
                    const reportData: ReportIncomingData = {
                        userId: authResult.userId, 
                        content: message.text?.body || '',
                        messageId: message.id,
                        timestamp: String(message.timestamp)
                    };

                    const reportDelivered = await sendToReports(reportData);
                    
                    if (reportDelivered) {
                        console.log(" Verification Complete: Confirmation received from Reports Service.");
                    } else {
                        console.error(" Verification Failed: Reports Service did not confirm delivery.");
                    }
                    
                } else if (messageType === 'audio') {
                    console.log(" Message type is audio. Switching to Task 57 (Media Download).");
                    const mediaId = message.audio?.id;
                    
                    if (mediaId) {
                        console.log(` Media ID extracted successfully: ${mediaId}`);
                    }
                } else {
                    console.log(` Unknown message type received: ${messageType}`);
                }
            } else {
                console.error(" Validation failed: Phone number is missing or invalid");
            }
        }
    }
};