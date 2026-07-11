import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

export const transcribeAudioFile = async (filePath: string,userId: string): Promise<string | null> => {
    try {

        const baseUrl = process.env.STT_SERVICE_URL;
        const apiPath = process.env.STT_SERVICE_API_PATH || '/audio/process';

        if (!baseUrl) {
            throw new Error("STT_SERVICE_URL is not defined");
        }

        const sttEndpoint = `${baseUrl}${apiPath}`; 
        
        const formData = new FormData();
        formData.append('audio', fs.createReadStream(filePath));
        formData.append('userId', userId);

        const response = await axios.post(sttEndpoint, formData, {
            headers: { ...formData.getHeaders() },
        });
        console.log("STT Response Data:", response.data);

        const transcribedText = response.data?.transcribedText || response.data?.text;
        
        return transcribedText || null;

    } catch (error: any) {
        console.error("[STT] Error:", error.message);
        return null;
    }
};