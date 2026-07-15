import { Request, Response } from 'express';
import { issueSupabaseSessionForEmployee } from '../services/OIDC.service.js';

const FRONTEND_URL = process.env.FRONTEND_URL;

export const handleOauthCallback = async (req: Request, res: Response) => {
  try {
    const email = (req as any).user?.email;
    if (!email) {
      return res.redirect(`${FRONTEND_URL}/login?error=oauth`);
    }

    const session = await issueSupabaseSessionForEmployee(email);
    const params = new URLSearchParams({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      type: 'oauth',
    });
    res.redirect(`${FRONTEND_URL}/EmployeePage#${params.toString()}`);
  } catch (err) {
    console.error('Google OAuth callback failed:', err);
    res.redirect(`${FRONTEND_URL}/login?error=oauth`);
  }
};

export const getProfile = (req: Request, res: Response) => {
  res.json({ employee: req.user });
};

export const logout = (req: Request, res: Response, next: any) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'You have successfully logged out'});
  });
};