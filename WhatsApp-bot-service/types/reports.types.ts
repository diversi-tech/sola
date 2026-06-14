
// ⚠️ TODO: DRAFT ONLY! 
// These types are a working draft based on assumptions. 
// Must be updated once the Reports team sends the official API specification!

export interface ReportIncomingData {
    userId: string;          
    content: string;         
    timestamp: string;      
    messageId: string;       
}

export interface ReportOutboundCommand {
    userId: string;          
    text: string;           
    status?: 'success' | 'error'; 
}