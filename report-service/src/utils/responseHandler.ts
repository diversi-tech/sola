import { Response } from 'express';

// --- פונקציות בסיס ---

export const sendSuccess = (res: Response, data: any, statusCode: number = 200) => {
  return res.status(statusCode).json({ success: true, data });
};

export const sendError = (res: Response, message: string, statusCode: number = 500) => {
  return res.status(statusCode).json({ success: false, error: message });
};

// --- פונקציות קיצור לשגיאות נפוצות ---

// 400 - נתונים שגויים או חסרים מהלקוח
export const sendBadRequest = (res: Response, message: string = 'נתונים לא תקינים או חסרים') => {
  return sendError(res, message, 400);
};

// 401 - המשתמש לא מחובר
export const sendUnauthorized = (res: Response, message: string = 'משתמש לא מורשה, יש להתחבר מחדש') => {
  return sendError(res, message, 401);
};

// 403 - מחובר אבל אין לו הרשאה מתאימה
export const sendForbidden = (res: Response, message: string = 'אין לך הרשאות גישה למשאב זה') => {
  return sendError(res, message, 403);
};

// 404 - המשאב לא נמצא
export const sendNotFound = (res: Response, message: string = 'המשאב המבוקש לא נמצא') => {
  return sendError(res, message, 404);
};