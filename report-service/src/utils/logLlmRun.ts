import fs from 'fs';
import path from 'path';

export const logLLMRun = (status: 'SUCCESS' | 'WARNING' | 'ERROR', details: string) => {
    const logFilePath = path.join(process.cwd(), 'ai-performance.log');
    
    const now = new Date();
    const timestamp = now.toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });
    
    const logLine = `[${timestamp}] [${status}] ${details}\n`;
    
    try {
        fs.appendFileSync(logFilePath, logLine, 'utf8');
    } catch (err) {
        console.error("Failed to write to AI log file", err);
    }
};