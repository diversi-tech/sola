export function handleProcessResult(status: string, info: string, userId: string): string {
    if (status === 'success') {
        return info; 
    }

    const lowMessage = info.toLowerCase();

    if (lowMessage.includes("no audio") || lowMessage.includes("missing file")) {
        return "לא נקלט קובץ שמע בבקשה. אנא ודאו שההקלטה נשלחה כראוי ונסו שוב.";
    }

    if (lowMessage.includes("25mb") || lowMessage.includes("too large")) {
        return "נפח קובץ השמע חורג מהמגבלה המותרת. המערכת תומכת בעיבוד קבצים של עד *25MB* בלבד.";
    }

    if (lowMessage.includes("format") || lowMessage.includes("invalid type")) {
        return "פורמט הקובץ אינו נתמך. אנא שלחו הקלטת שמע סטנדרטית .";
    }

    if (lowMessage.includes("empty") || lowMessage.includes("no speech")) {
        return "לא זוהה דיבור בקובץ השמע. אנא ודאו שההקלטה ברורה ונסו שוב.";
    }

    if (lowMessage.includes("userid") || !userId) {
        return "שגיאת מערכת: לא ניתן לבצע את הפעולה עבור מזהה המשתמש הנוכחי.";
    }

    return "הפעולה נכשלה עקב שגיאה פנימית זמנית במערכת. אנא נסו לשלוח שוב בעוד מספר דקות.";
}
