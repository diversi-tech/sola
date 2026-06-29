export interface User {
  id: number;                  // שינינו ל-number בגלל ה-bigint
  employee_email: string;      // השם המדויק מהסכמה
  state?: string;
  status: string;              // מקבל את ה-default 'INACTIVE'
  refresh_token?: string;
  created_at: Date;
  updated_at?: Date;
}