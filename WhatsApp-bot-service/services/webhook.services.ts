import axios from 'axios'; 
const META_API_BASE_URL = 'https://graph.facebook.com/v18.0';
export const checkVerifyToken = (mode: string, token: string): boolean => {
  const verification_token = process.env.VERIFY_TOKEN;
  return mode === 'subscribe' && token === verification_token;
};

const WHATSAPP_BUSINESS = 'whatsapp_business_account';


const sendReadReceipt = async (messageId: string): Promise<void> => {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    console.error(" Missing Meta credentials in environment variables");
    return;
  }

  try {
    const url = `${META_API_BASE_URL}/${phoneNumberId}/messages`;
   
    
    const payload = {
      messaging_product: "whatsapp",
      status: "read", 
      message_id: messageId 
    };

    await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(` Read receipt sent successfully for message ID: ${messageId}`);
  } catch (error) {
    console.error(" Failed to send read receipt to Meta (Bot is still running):", error);
  }
};

export const processWebhookEvent = (body: any) => {
    
    console.log(': Received webhook event in service:', JSON.stringify(body, null, 2));

    if (body.object === WHATSAPP_BUSINESS) {
        
        const messages = body.entry?.[0]?.changes?.[0]?.value?.messages;

        if (messages?.length) {
            const message = messages[0];
            
           
            const messageId = message.id;
            if (messageId) {
                sendReadReceipt(messageId); 
            }

            const extractedPhoneNumber = message.from; 

            if (typeof extractedPhoneNumber === 'string' && extractedPhoneNumber.trim() !== '') {
                
                let senderPhoneNumber = extractedPhoneNumber; 
                
                console.log(" Success! Extracted phone number:", senderPhoneNumber);
                
                return senderPhoneNumber;
                
            } else {
                console.error(" Validation failed: Phone number is missing or invalid");
            }
        }
    }
};