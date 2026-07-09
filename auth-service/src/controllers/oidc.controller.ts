import { Request, Response } from 'express';

export const handleOauthCallback = (req: Request, res: Response) => {

  res.redirect('http://localhost:5173/dashboard'); 
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