import axios from 'axios';
import { ReportIncomingData } from '../types/reports.types';

export const sendToReports = async (data: ReportIncomingData): Promise<boolean> => {
    try {
        const reportsApiUrl = process.env.REPORTS_SERVICE_URL; 
        const reportsApiPath = process.env.REPORTS_SERVICE_API_PATH;
        
        if (!reportsApiUrl || !reportsApiPath) {
            console.error("Missing REPORTS_SERVICE_URL or REPORTS_SERVICE_API_PATH in environment variables");
            return false;
        }

        const reportsServiceUrl = `${reportsApiUrl}${reportsApiPath}`;

        console.log(`Sending real data to Reports Service at ${reportsServiceUrl}...`);
        await axios.post(reportsServiceUrl, data);
        
        console.log("Data successfully delivered to Reports Team!");
        return true;
    } catch (error) {
        console.error("Failed to send data to Reports Service:", error);
        return false;
    }
};