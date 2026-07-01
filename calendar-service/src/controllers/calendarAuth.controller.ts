import { Request, Response } from 'express';
import crypto from 'crypto';
import { generateGoogleAuthUrl } from '../services/googleAuth.service.js';
import { sendCalendarAuthEmail } from '../services/email.service.js';

export const generateAuthUrlHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employee_email } = req.body;

    if (!employee_email) {
      res.status(400).json({ error: 'employee_email is required' });
      return;
    }
    const state = crypto.randomBytes(16).toString('hex');
    const authUrl = await generateGoogleAuthUrl(employee_email, state);
    console.log('Auth URL:', authUrl);

   await sendCalendarAuthEmail(employee_email, authUrl);
   res.status(200).json({
      message: 'קישור האישור נשלח בהצלחה למייל העובד' 
   })
    
  } catch (err: any) {
    console.error('Unexpected error in handler:', err);
    if (err.message === 'Database insertion failed') {
      res.status(500).json({ error: 'Failed to initialize auth session' });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};