
// TODO: DRAFT ONLY! 
// These types are a working draft based on assumptions. 
// Must be updated once the Reports team sends the official API specification!

export interface ReportIncomingData {
    manager_id: string;          
    text: string;         
    timestamp: string;      
    messageId: string;       
}

export interface ReportOutboundCommand {
    manager_id: string;          
    text: string;           
    status?: 'success' | 'error'; 
}