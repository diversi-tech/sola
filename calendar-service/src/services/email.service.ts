import { google } from 'googleapis';
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const sender = process.env.GMAIL_SENDER || process.env.EMAIL_USER;
const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

export const assertEmailConfig = (): void => {
  const missing = [
    ['GOOGLE_CLIENT_ID', clientId],
    ['GOOGLE_CLIENT_SECRET', clientSecret],
    ['GMAIL_SENDER (or EMAIL_USER)', sender],
    ['GMAIL_REFRESH_TOKEN', refreshToken],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Email service misconfigured — missing env vars: ${missing.join(', ')}`);
  }
};

const getGmailClient = () => {
  assertEmailConfig();
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return google.gmail({ version: 'v1', auth: oauth2Client });
};

const encodeSubject = (subject: string): string =>
  `=?UTF-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`;

const buildRawMessage = (to: string, subject: string, html: string): string => {
  const message = [
    `From: ${sender}`,
    `To: ${to}`,
    `Subject: ${encodeSubject(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(html, 'utf-8').toString('base64').replace(/(.{76})/g, '$1\r\n'),
  ].join('\r\n');


  return Buffer.from(message, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const sendCalendarAuthEmail = async (
  employeeEmail: string,
  authUrl: string
): Promise<void> => {
  const html = `
      <div style="direction: rtl; font-family: Arial, sans-serif; padding: 20px;">
        <h2>שלום,</h2>
        <p>המנהל שלך ביקש לחבר את יומן Google שלך למערכת Sola.</p>
        <p>לחץ על הכפתור הבא כדי לאשר:</p>
        <a href="${authUrl}"
           style="background-color: #2563eb; color: white; padding: 12px 24px;
                  text-decoration: none; border-radius: 8px; display: inline-block; margin: 16px 0;">
          אישור גישה ליומן
        </a>
        <p style="color: #6b7280; font-size: 12px;">
          אם לא ביקשת זאת, תוכל להתעלם מהמייל הזה.
        </p>
      </div>
    `;

  const gmail = getGmailClient();
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: buildRawMessage(employeeEmail, 'אישור גישה ליומן Google - מערכת Sola', html),
    },
  });
};
