import { Request, Response } from 'express';

const FRONTEND_URL = process.env.FRONTEND_URL;

export const handleOauthCallback = (req: Request, res: Response) => {
  res.redirect(`${FRONTEND_URL}/dashboard`);
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