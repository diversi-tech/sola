export const checkVerifyToken = (mode: string, token: string): boolean => {
    const verifyToken = process.env.VERIFY_TOKEN;
    return mode === 'subscribe' && token === verifyToken;
};


export const processWebhookEvent = (body: any) => {
    //todo:
    // כאן בהמשך הספרינט אנחנו נוסיף את הקוד שמפרק את ההודעה,
    // שולח למסד הנתונים של Supabase, או מחזיר תשובה למשתמש.
    console.log(':envelope_with_arrow: Received webhook event in service:', JSON.stringify(body, null, 2));
}