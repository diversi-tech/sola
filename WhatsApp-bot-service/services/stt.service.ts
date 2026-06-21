import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

export const transcribeAudioFile = async (filePath: string): Promise<string | null> => {
    try {
        const baseUrl = process.env.STT_SERVICE_URL;

        if (!baseUrl) {
            throw new Error("STT_SERVICE_URL is not defined in the environment variables");
        }

        const sttEndpoint = `${baseUrl}/audio/process`;
        
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        console.log(`[STT] Forwarding audio file to STT service: ${sttEndpoint}`);

        const response = await axios.post(sttEndpoint, formData, {
            headers: {
                ...formData.getHeaders(), 
            },
        });

        const transcribedText = response.data?.transcribedText || response.data?.text;

        if (!transcribedText) {
            console.error("[STT] API responded successfully but missing text fields:", response.data);
            return null;
        }

        console.log("[STT] Transcription received successfully:", transcribedText);
        return transcribedText;

    } catch (error: any) {
        console.error("[STT] Error forwarding audio to STT service:", error.message || error);
        return null;
    }
};