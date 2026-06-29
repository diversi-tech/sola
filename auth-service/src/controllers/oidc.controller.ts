// src/controllers/oidc.controller.ts
import { Request, Response } from 'express';

export const handleGoogleCallback = (req: Request, res: Response) => {

  res.redirect('http://localhost:5173/dashboard'); 
};

export const getProfile = (req: Request, res: Response) => {
  res.json({ user: req.user });
};

export const logout = (req: Request, res: Response, next: any) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'You have successfully logged out'});
  });
};