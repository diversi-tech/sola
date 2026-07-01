import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendCalendarAuthEmail = async (
  employeeEmail: string,
  authUrl: string
): Promise<void> => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: employeeEmail,
    subject: 'אישור גישה ליומן Google - מערכת Sola',
    html: `
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
    `,
  });
};