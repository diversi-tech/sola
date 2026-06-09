import streamifier from 'streamifier';
import FormData from 'form-data';
import axios from 'axios';
import * as integrationService from './integration.service';

export const handleAudioProcessingPipeline = async (file: any, userData: any) => {
    try {
        const audioStream = streamifier.createReadStream(file.buffer);
        const transcriptionText = await transcribeAudio(audioStream);

        await integrationService.handleProcessResult({
            userId: userData.userId,
            text: transcriptionText,
            status: "success"
        });
        
    } catch (error) {
        console.error("Pipeline Error:", error);
        
        await integrationService.handleProcessResult({
            userId: userData.userId,
            message: "Audio processing error",
            status: "error"
        });
    }
};
const transcribeAudio = async (audioStream: any): Promise<string> => {
    const form = new FormData();
    
    form.append('model', 'whisper-large-v3');
    form.append('file', audioStream, {
        filename: 'whatsapp_audio.ogg',
        contentType: 'audio/ogg'
    });

    const headers = {
        ...form.getHeaders(),
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    };

    const response = await axios.post(
        'https://api.groq.com/openai/v1/audio/transcriptions',
        form,
        { headers: headers }
    );

    return response.data.text;
};
