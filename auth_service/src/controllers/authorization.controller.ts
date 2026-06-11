import { Request, Response, NextFunction } from 'express';
import { isUserAuthorized } from '../services/authorization.service.js';
import { HttpStatusCode } from '../types/httpStatusCodes.js';

export const loginHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const phoneNumber = req.body.phoneNumber;

    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ 
        IsSucceeded: false, 
        statusCode: HttpStatusCode.BAD_REQUEST, 
        message: "Phone number is required and must start with '+'" 
      });
      return;
    }

    const authorized = await isUserAuthorized(phoneNumber);

    if (authorized) {
      res.status(HttpStatusCode.OK).json({ 
        IsSucceeded: true, 
        statusCode: HttpStatusCode.OK, 
        message: "User is authorized" 
      });
    } else {
      res.status(HttpStatusCode.UNAUTHORIZED).json({ 
        IsSucceeded: false, 
        statusCode: HttpStatusCode.UNAUTHORIZED, 
        message: "User is not authorized" 
      });
    }
  } catch (error) {
    next(error);
  }
};