export interface StatusPageData {
  title: string;
  message: string;
  success: boolean;
}

export function CalendarAuthSuccessPage(): StatusPageData {
  return {
    title: 'הגישה אושרה בהצלחה!',
    message: 'ניתן לסגור את החלון.',
    success: true,
  };
}

export function CalendarAuthAlreadyActivePage(): StatusPageData {
  return {
    title: 'הגישה כבר אושרה',
    message: 'כבר אישרת גישה ליומן בעבר. אין צורך לבצע פעולה נוספת.',
    success: true,
  };
}

export function CalendarAuthDeniedPage(): StatusPageData {
  return {
    title: 'הבקשה נדחתה',
    message: 'סירבת לאשר גישה ליומן. אם זו טעות, בקש/י מהמנהל לשלוח בקשה חדשה.',
    success: false,
  };
}

export function CalendarAuthExpiredPage(): StatusPageData {
  return {
    title: 'הקישור פג תוקף',
    message: 'הקישור אינו תקין או שכבר נוצל. בקש/י מהמנהל לשלוח בקשה חדשה.',
    success: false,
  };
}

export function CalendarAuthGoogleErrorPage(): StatusPageData {
  return {
    title: 'שגיאה בתקשורת עם Google',
    message: 'אירעה שגיאה בעת האימות מול Google. נסה/י שוב מאוחר יותר.',
    success: false,
  };
}

export function CalendarAuthInvalidRequestPage(): StatusPageData {
  return {
    title: 'בקשה לא תקינה',
    message: 'חסרים נתונים בבקשה מ-Google.',
    success: false,
  };
}

export function CalendarAuthGenericErrorPage(customMessage?: string): StatusPageData {
  return {
    title: 'שגיאה',
    message: customMessage || 'אירעה שגיאה בלתי צפויה. נסה/י שוב מאוחר יותר.',
    success: false,
  };
}