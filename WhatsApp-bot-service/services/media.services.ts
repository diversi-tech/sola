import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const downloadAudioFile = async (mediaId: string): Promise<string | null> => {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const META_API_BASE_URL = process.env.META_API_BASE_URL || 'https://graph.facebook.com/v18.0';

    try {
        const response = await axios.get(`${META_API_BASE_URL}/${mediaId}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const mediaUrl = response.data.url;
        const audioResponse = await axios.get(mediaUrl, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            responseType: 'arraybuffer'
        });

        const uploadDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        
        const filePath = path.join(uploadDir, `${mediaId}.ogg`);
        fs.writeFileSync(filePath, audioResponse.data);
        
        console.log(`Audio file saved successfully at: ${filePath}`);
        return filePath;

    } catch (error) {
        console.error("Failed to download audio:", error);
        return null;
    }
};