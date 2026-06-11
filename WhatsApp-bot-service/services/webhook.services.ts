export const checkVerifyToken = (mode: string, token: string): boolean => {
  const verifyToken = process.env.VERIFY_TOKEN;
  return mode === 'subscribe' && token === verifyToken;
};


export const processWebhookEvent = (body: any) => {
    
    console.log(':envelope_with_arrow: Received webhook event in service:', JSON.stringify(body, null, 2));

    //check if the webhook event is from a WhatsApp Business Account
    if (body.object === 'whatsapp_business_account') {
        
        // extract the messages array from the webhook payload
        const messages = body.entry?.[0]?.changes?.[0]?.value?.messages;

        
        if (messages && messages.length > 0) {
            const message = messages[0];
            
            //extracts sender's phone number from the message object
            const extractedPhoneNumber = message.from; 

            //validation to check that the extracted phone number is a non-empty string 
            if (typeof extractedPhoneNumber === 'string' && extractedPhoneNumber.trim() !== '') {
                
                
                let senderPhoneNumber = extractedPhoneNumber; 
                
                console.log("✅ Success! Extracted phone number:", senderPhoneNumber);
                
                // return the phone number so we can use it later in the flow (e.g., task #46)
                return senderPhoneNumber;
                
            } else {
                console.error("❌ Validation failed: Phone number is missing or invalid");
            }
        }
    }
};