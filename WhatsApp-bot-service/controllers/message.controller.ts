import { Request, Response } from 'express';
import { sendWhatsAppMessage } from '../services/webhook.services';

export const handleSendInternalMessage = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const expectedKey = `Bearer ${process.env.INTERNAL_API_KEY}`;
    
    if (authHeader !== expectedKey) {
        console.warn("Unauthorized attempt to send message from Reports!");
        return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
    }

    const { toPhoneNumber, success, data, error } = req.body;

    if (!toPhoneNumber) {
        return res.status(400).json({ error: "Missing required field: toPhoneNumber " });
    }
    let textContent = "";


    if (success === true) {
       const summary = data?.savedReport?.[0]?.text_summary || "No text summary received";
       textContent = `The report was saved successfully! Here is the summary:\n${summary}`;
    }  else {
           const errorMessage = error || "An unknown error occurred in the system";
           textContent = `Oops, an error occurred:\n${errorMessage}`;
}

    try {
        await sendWhatsAppMessage(toPhoneNumber, textContent);
        
        return res.status(200).json({ 
            success: true, 
            message: "Message dispatched to WhatsApp API successfully" 
        });
    } catch (error: any) {
        console.error("Failed to process outbound message:", error);
        return res.status(500).json({ error: "Internal Server Error during message dispatch" });
    }
};