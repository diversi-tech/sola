import { Response } from 'express';

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

export const sendSuccessResult = (res: Response, data: any, statusCode: HttpStatusCode = HttpStatusCode.OK) => {
  return res.status(statusCode).json({ success: true, data });
};

export const sendCreatedResult = (res: Response, data: any) => {
  return res.status(HttpStatusCode.CREATED).json({ success: true, data });
};

export const sendErrorResult = (res: Response, message: string, statusCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR, additionalData?: any) => {
    
    if (additionalData) {
        return res.status(statusCode).json({ success: false, error: message, data: additionalData });
    }
        return res.status(statusCode).json({ success: false, error: message });
};

export const sendBadRequestResult = (res: Response, message: string = 'Invalid or missing data') => {
  return sendErrorResult(res, message, HttpStatusCode.BAD_REQUEST);
};

export const sendUnauthorizedResult = (res: Response, message: string = 'Unauthorized, please log in again') => {
  return sendErrorResult(res, message, HttpStatusCode.UNAUTHORIZED);
};

export const sendForbiddenResult = (res: Response, message: string = 'You do not have permission to access this resource') => {
  return sendErrorResult(res, message, HttpStatusCode.FORBIDDEN);
};

export const sendNotFoundResult = (res: Response, message: string = 'The requested resource was not found') => {
  return sendErrorResult(res, message, HttpStatusCode.NOT_FOUND);
};