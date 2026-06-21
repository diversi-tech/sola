import crypto from 'crypto';
import dotenv from 'dotenv';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_secret_key_32_characters_';
const ALGORITHM = 'aes-256-cbc';

export const encryptToken = (text: string): string => {
    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};