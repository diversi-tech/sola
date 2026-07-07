import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../types/httpStatusCodes.js';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.util.js';
import { authenticateUser } from '../services/authorization.service.js';

export const loginHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const phone_number = req.body.phone_number;

    if (!phone_number || !phone_number.startsWith('+')) {
      sendErrorResponse(res, HttpStatusCode.BAD_REQUEST, "Phone number is required and must start with country code.");
      return;
    }

    const user = await authenticateUser(phone_number);

    if (user) {
      sendSuccessResponse(res, HttpStatusCode.OK, "User is authorized", { phone_number, userId: user.user_id });
    } else {
      sendErrorResponse(res, HttpStatusCode.UNAUTHORIZED, "User is not authorized");
    }
  } catch (error) {
    next(error);
  }
};