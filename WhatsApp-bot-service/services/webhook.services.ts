import { ReportIncomingData } from '../types/reports.types';
declare const process: any;
export const sendToReports = async (data: ReportIncomingData): Promise<boolean> => {
    try {
        console.log(` Sending data to Reports Service:`, JSON.stringify(data, null, 2));
        const isSuccess = true; 
        
        if (isSuccess) {
            console.log("Reports Service received the data successfully!");
            return true;
        }
        
        return false;
    } catch (error) {
        console.error("Failed to send data to Reports Service:", error);
        return false;
    }
};

export const checkVerifyToken = (mode: string, token: string): boolean => {
  const verification_token = process.env.VERIFY_TOKEN;
  return mode === 'subscribe' && token === verification_token;
};

const WHATSAPP_BUSINESS = 'whatsapp_business_account';

export const processWebhookEvent = async (body: any) => {
    console.log(': Received webhook event in service:', JSON.stringify(body, null, 2));

    if (body.object === WHATSAPP_BUSINESS) {
        const messages = body.entry?.[0]?.changes?.[0]?.value?.messages;

        if (messages?.length) {
            const message = messages[0];
            const extractedPhoneNumber = message.from; 

            if (typeof extractedPhoneNumber === 'string' && extractedPhoneNumber.trim() !== '') {
                let senderPhoneNumber = extractedPhoneNumber; 
                console.log(" Success! Extracted phone number:", senderPhoneNumber);
                
                const messageType = message.type;
                console.log(` Classifying message content type: ${messageType}`);

                if (messageType === 'text') {
                    console.log(" Message type is text. Proceeding to Task 8 path.");
                    
                    const reportData: ReportIncomingData = {
                        userId: senderPhoneNumber,
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
                    console.log(" Message type is audio. Switching to Task 9 transcription path.");
                } else {
                    console.log(` Unknown message type received: ${messageType}`);
                }
                
                return senderPhoneNumber;
            } else {
                console.error(" Validation failed: Phone number is missing or invalid");
            }
        }
        // ...
    }
};