import { Request, Response } from 'express';
import crypto from 'crypto';
import { generateGoogleAuthUrl, getAuthStatuses, revokeCalendarAccess  } from '../services/googleAuth.service.js';
import { sendCalendarAuthEmail } from '../services/email.service.js';
import { catchAsync } from '../middleware/error.middleware.js';


export const generateAuthUrlHandler = catchAsync(async (req: Request, res: Response) => {
  const { employee_email } = req.body;

  if (!employee_email) {
    res.status(400).json({ error: 'employee_email is required' });
    return;
  }

  const state = crypto.randomBytes(16).toString('hex');
  const authUrl = await generateGoogleAuthUrl(employee_email, state);

  await sendCalendarAuthEmail(employee_email, authUrl);

  res.status(200).json({
    message: "The request was successfully sent to the employee's email"
  });
});
export const getAuthStatusesHandler = catchAsync(async (req: Request, res: Response) => {
  const emailsParam = req.query.emails as string | undefined;

  if (!emailsParam) {
    res.status(400).json({ error: 'emails query param is required' });
    return;
  }

  const emails = emailsParam.split(',').map((e) => e.trim());
  const statusMap = await getAuthStatuses(emails);

  res.status(200).json(statusMap);
});

export const revokeCalendarAccessHandler = catchAsync(async (req: Request, res: Response) => {
  const { employee_email } = req.body;

  if (!employee_email) {
    res.status(400).json({ error: 'employee_email is required' });
    return;
  }

  await revokeCalendarAccess(employee_email);

  res.status(200).json({ message: 'Access revoked successfully' });
});