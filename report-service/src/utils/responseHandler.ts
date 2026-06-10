import { Response } from 'express';


export const sendSuccessResult = (res: Response, data: any, statusCode: number = 200) => {
  return res.status(statusCode).json({ success: true, data });
};

export const sendErrorResult = (res: Response, message: string, statusCode: number = 500) => {
  return res.status(statusCode).json({ success: false, error: message });
};


export const sendBadRequestResult = (res: Response, message: string = 'Invalid or missing data') => {
  return sendErrorResult(res, message, 400);
};

export const sendUnauthorizedResult = (res: Response, message: string = 'Unauthorized, please log in again') => {
  return sendErrorResult(res, message, 401);
};

export const sendForbiddenResult = (res: Response, message: string = 'You do not have permission to access this resource') => {
  return sendErrorResult(res, message, 403);
};

export const sendNotFoundResult = (res: Response, message: string = 'The requested resource was not found') => {
  return sendErrorResult(res, message, 404);
};