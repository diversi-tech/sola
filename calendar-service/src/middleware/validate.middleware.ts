import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from './error.middleware.js'; 

export function validateSyncCalendarInput(req: Request, res: Response, next: NextFunction) {
  const userID = req.query.userID;
  
  if (!userID || isNaN(Number(userID))) {
    return next(new BadRequestError("Valid userID query parameter is required."));
  }
 
  if (!req.body) {
    return next(new BadRequestError("Request body is missing."));
  }

  const refresh_token = req.body.refresh_token;

  if (!refresh_token) {
    return next(new BadRequestError("refresh_token is required in body."));
  }

  next();
}