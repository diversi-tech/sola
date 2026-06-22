import { Response } from 'express';
import { HttpStatusCode } from '../types/httpStatusCodes.js';

export const sendSuccessResponse = (
  res: Response, 
  statusCode: HttpStatusCode, 
  message: string, 
  data?: any 
): void => {
  res.status(statusCode).json({
    IsSucceeded: true,
    statusCode: statusCode,
    message: message,
    ...data
  });
};

export const sendErrorResponse = (
  res: Response, 
  statusCode: HttpStatusCode, 
  message: string
): void => {
  res.status(statusCode).json({
    IsSucceeded: false,
    statusCode: statusCode,
    message: message
  });
};