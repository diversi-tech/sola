import axios from 'axios';
import { ReportIncomingData } from '../types/reports.types';

export const sendToReports = async (data: ReportIncomingData): Promise<boolean> => {
    try {
        const reportsApiUrl = process.env.REPORTS_SERVICE_URL; 
        
        if (!reportsApiUrl) {
            console.error("Missing REPORTS_SERVICE_URL in .env file");
            return false;
        }

        console.log(`Sending real data to Reports Service at ${reportsApiUrl}...`);
        await axios.post(reportsApiUrl, data);
        
        console.log("Data successfully delivered to Reports Team!");
        return true;
    } catch (error) {
        
        console.error("Failed to send data to Reports Service:", error);
        return false;
    }
};