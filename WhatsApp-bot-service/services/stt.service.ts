import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

/**
 * שירות המשלב את משימה 55 - שליחת קובץ האודיו המקומי לשרת ה-STT
 * @param filePath הנתיב המקומי של קובץ האודיו בשרת
 * @returns הטקסט המתומלל או null במקרה של שגיאה
 */
export const transcribeAudioFile = async (filePath: string): Promise<string | null> => {
    try {
       
        const baseUrl = process.env.STT_SERVICE_URL || 'http://localhost:3000';
        const sttEndpoint = `${baseUrl}/v1/audio/process`;

       
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