import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from './error.middleware.js'; 

export function validateSyncCalendarInput(req: Request, res: Response, next: NextFunction) {
  const userID = req.query.userID;
  
  // 1. בדיקת ה-userID מה-query string
  if (!userID || isNaN(Number(userID))) {
    return next(new BadRequestError("Valid userID query parameter is required."));
  }
  
  // 2. הגנה מפני req.body ריק או חסר
  if (!req.body) {
    return next(new BadRequestError("Request body is missing."));
  }

  const refresh_token = req.body.refresh_token;

  // 3. בדיקת קיום ה-token
  if (!refresh_token) {
    return next(new BadRequestError("refresh_token is required in body."));
  }

  next();
}