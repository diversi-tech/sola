import { Response } from 'express';


export const sendSuccess = (res: Response, data: any, statusCode: number = 200) => {
  return res.status(statusCode).json({ success: true, data });
};

export const sendError = (res: Response, message: string, statusCode: number = 500) => {
  return res.status(statusCode).json({ success: false, error: message });
};


// Error - 400
export const sendBadRequest = (res: Response, message: string = 'נתונים לא תקינים או חסרים') => {
  return sendError(res, message, 400);
};

// Error - 401
export const sendUnauthorized = (res: Response, message: string = 'משתמש לא מורשה, יש להתחבר מחדש') => {
  return sendError(res, message, 401);
};

// Error - 403
export const sendForbidden = (res: Response, message: string = 'אין לך הרשאות גישה למשאב זה') => {
  return sendError(res, message, 403);
};

// Error - 404
export const sendNotFound = (res: Response, message: string = 'המשאב המבוקש לא נמצא') => {
  return sendError(res, message, 404);
};
