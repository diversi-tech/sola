import { Request, Response } from 'express';
import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import { generateGoogleAuthUrl } from '../services/googleAuth.service.js';

export const generateAuthUrlHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employee_email } = req.body;
    if (!employee_email) {
      res.status(400).json({ error: 'employee_email is required' });
      return;
    }

    const state = crypto.randomBytes(16).toString('hex');
    const { error } = await supabase
      .from('Users')
      .insert([
        {
          employee_email: employee_email,
          state: state
        }
      ]);

    if (error) {
      console.error('Supabase insertion error:', error);
      res.status(500).json({ error: 'Failed to initialize auth session' });
      return;
    }
    const authUrl = generateGoogleAuthUrl(state, employee_email);
    res.status(200).json({ 
      auth_url: authUrl 
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};