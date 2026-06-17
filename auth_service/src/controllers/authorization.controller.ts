import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../types/httpStatusCodes.js';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.util.js';
import { authenticateUser } from '../services/authorization.service.js';

export const loginHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const phoneNumber = req.body.phoneNumber;

    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      sendErrorResponse(res, HttpStatusCode.BAD_REQUEST, "Phone number is required and must start with '+'");
      return;
    }

    const user = await authenticateUser(phoneNumber);

    if (user) {
      sendSuccessResponse(res, HttpStatusCode.OK, "User is authorized", { phoneNumber, userId: user.ID });
    } else {
      sendErrorResponse(res, HttpStatusCode.UNAUTHORIZED, "User is not authorized");
    }
  } catch (error) {
    next(error);
  }
};