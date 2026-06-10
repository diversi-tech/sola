import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, statusCode: number = 200) => {
  return res.status(statusCode).json({ success: true, data });
};

export const sendError = (res: Response, message: string, statusCode: number = 500) => {
  return res.status(statusCode).json({ success: false, error: message });
};


export const sendBadRequest = (res: Response, message: string = 'Invalid or missing data') => {
  return sendError(res, message, 400);
};

export const sendUnauthorized = (res: Response, message: string = 'Unauthorized, please log in again') => {
  return sendError(res, message, 401);
};

export const sendForbidden = (res: Response, message: string = 'You do not have permission to access this resource') => {
  return sendError(res, message, 403);
};

export const sendNotFound = (res: Response, message: string = 'The requested resource was not found') => {
  return sendError(res, message, 404);
};
