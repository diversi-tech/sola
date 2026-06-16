export const checkVerifyToken = (mode: string, token: string): boolean => {
  const verification_token = process.env.VERIFY_TOKEN;
  return mode === 'subscribe' && token === verification_token;
};

const WHATSAPP_BUSINESS = 'whatsapp_business_account';
export const processWebhookEvent = (body: any) => {
    
    console.log(': Received webhook event in service:', JSON.stringify(body, null, 2));

    if (body.object === WHATSAPP_BUSINESS) {
        
        const messages = body.entry?.[0]?.changes?.[0]?.value?.messages;

        
    
        if (messages?.length) {
            const message = messages[0];
            const extractedPhoneNumber = message.from; 

            if (typeof extractedPhoneNumber === 'string' && extractedPhoneNumber.trim() !== '') {
                let senderPhoneNumber = extractedPhoneNumber; 
                console.log(" Success! Extracted phone number:", senderPhoneNumber);
                
             
                const authPayload = { 
                    "phoneNumber": senderPhoneNumber 
                    
                };
                console.log(" Packed auth payload:", authPayload);
          
                return authPayload; 
            } else {
                console.error(" Validation failed: Phone number is missing or invalid");
            }
        }
        
     
    }
};