import streamifier from 'streamifier';
import FormData from 'form-data';
import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

export const handleAudioProcessingPipeline = async (file: any, userData: any): Promise<string> => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("Configuration Error: GROQ_API_KEY is not defined.");
    }

    const audioStream = streamifier.createReadStream(file.buffer);

    try {
        return await transcribeAudio(audioStream);
    } catch (error: any) {
        console.error("Pipeline Error:", error.message);
        throw error;
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

    const response = await axios.post(GROQ_API_URL, form, { headers });
    return response.data.text;
};