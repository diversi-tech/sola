import { Request, Response } from 'express';
import { sendWhatsAppMessage } from '../services/webhook.services';

export const handleSendInternalMessage = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const expectedKey = `Bearer ${process.env.INTERNAL_API_KEY}`;
    
    if (authHeader !== expectedKey) {
        console.warn("Unauthorized attempt to send message from Reports!");
        return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
    }

    const { toPhoneNumber: to, success, data, error } = req.body;

    if (!to) {
        return res.status(400).json({ error: "Missing required field: toPhoneNumber" });
    }
    
    let textContent = "";

if (success === true) {
        const summary = data?.savedReport?.[0]?.text_summary;
        if (summary) {
            textContent = `Hi! Your report was successfully received and saved. Here is the analysis summary:\n${summary}`;
        } else {
            textContent = "Hi! Your report was successfully received and saved, but no analysis summary was generated.";
        }
    } else {
        textContent = "Oops, an error occurred. Your message wasn't received.";
    }

    try {
        await sendWhatsAppMessage(to, textContent);
        
        return res.status(200).json({ 
            success: true, 
            message: "Message dispatched to WhatsApp API successfully" 
        });
    } catch (error: any) {
        console.error("Failed to process outbound message:", error);
        return res.status(500).json({ error: "Internal Server Error during message dispatch" });
    }
};
