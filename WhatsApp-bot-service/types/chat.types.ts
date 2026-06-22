

export type MessageType = 'text' | 'audio';

export interface IncomingChatMessage {
    messageId: string;      
    senderPhone: string;     
    timestamp: string;       
    messageType: MessageType; 
    payload: {
        text?: string;      
        audioId?: string;    
    };
}

export interface OutgoingWhatsAppMessage {
    messaging_product: "whatsapp"; 
    recipient_type: "individual";  
    to: string;                    
    type: "text";                 
    text: {
        preview_url: boolean;      
        body: string;              
    };
}