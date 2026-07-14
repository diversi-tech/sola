import { Request, Response } from 'express';

export const handleOauthCallback = (req: Request, res: Response) => {
  const frontendUrl = process.env.FRONTEND_URL;
  if (!frontendUrl) {
    return res.status(500).send("Server configuration error: FRONTEND_URL is missing.");
  }
  res.redirect(`${frontendUrl}/update-password`);
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