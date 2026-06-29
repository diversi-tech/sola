import { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next(); 
  }
    res.status(401).json({ message: 'גישה לא מורשית - עליך להתחבר' });
};