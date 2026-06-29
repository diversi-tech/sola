import { supabase } from '../config/supabase.js';

export const findOrCreateGoogleUser = async (profile: any) => {
  // const email = profile.emails[0].value;

  // // 1. בדיקה אם המשתמש כבר קיים לפי האימייל (employee_email)
  // const { data: existingUser, error: searchError } = await supabase
  //   .from('Users')
  //   .select('*')
  //   .eq('employee_email', email)
  //   .single();

  // if (searchError && searchError.code !== 'PGRST116') {
  //   throw new Error(`שגיאה בחיפוש משתמש: ${searchError.message}`);
  // }

  // // אם המשתמש קיים - נחזיר אותו מיד
  // if (existingUser) {
  //   return existingUser;
  // }

  // // 2. אם לא קיים - ניצור משתמש חדש
  // // שימי לב: אנחנו מכניסים רק את מה שהסכמה מרשה (אימייל). סטטוס ו-ID ייווצרו אוטומטית.
  // const { data: newUser, error: insertError } = await supabase
  //   .from('Users')
  //   .insert([{ 
  //     employee_email: email 
  //   }])
  //   .select() // הפקודה הזו אומרת ל-Supabase להחזיר לנו את המשתמש שזה עתה נוצר
  //   .single();

  // if (insertError) {
  //   throw new Error(`שגיאה ביצירת משתמש: ${insertError.message}`);
  // }

  // return newUser;
};

export const getUserById = async (id: number) => { 
  const { data, error } = await supabase
    .from('Users')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Database error: ${error.message}`);
  }
  
  return data;
};