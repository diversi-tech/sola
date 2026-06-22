import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../types/httpStatusCodes.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error caught in central middleware:', err);

  const statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    IsSucceeded: false,
    statusCode: statusCode,
    message: message
  });
};