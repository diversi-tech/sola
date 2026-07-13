import { Request, Response } from 'express';

export const handleOauthCallback = (req: Request, res: Response) => {
  const dashboardUrl = process.env.DASHBOARD_URL;
  if (!dashboardUrl) {
    return res.status(500).send("Server configuration error: DASHBOARD_URL is missing.");
  }
  res.redirect(dashboardUrl);
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