import { ReportIncomingData } from '../types/reports.types';

export const sendToReports = async (data: ReportIncomingData): Promise<boolean> => {
    try {
        console.log(`Sending data to Reports Service:`, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error("Failed to send data to Reports Service:", error);
        return false;
    }
};