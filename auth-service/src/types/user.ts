export interface User {
  id: number;                  
  employee_email: string;      
  state?: string;
  status: string;         
  refresh_token?: string;
  created_at: Date;
  updated_at?: Date;
}