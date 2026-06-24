import axios from 'axios';

export const verifyUserAuth = async (authPayload: { phone_number: string }) => {
     
    const authBaseUrl = process.env.AUTH_BASE_URL;
    const authLoginPath = process.env.AUTH_LOGIN_PATH;

    if (!authBaseUrl || !authLoginPath) {
        throw new Error("AUTH_BASE_URL or AUTH_LOGIN_PATH is not defined in environment variables");
    }

    const authApiUrl = `${authBaseUrl}${authLoginPath}`;

    try {
        const response = await axios.post(authApiUrl, authPayload);
        const { IsSucceeded, message, userId } = response.data;

        return {
            isAuthorized: IsSucceeded,
            message: message,
            userId: userId || null
        };

    } catch (error: any) {
        if (error.response) {
            const { IsSucceeded, message } = error.response.data;
            return {
                isAuthorized: IsSucceeded,
                message: message,
                userId: null
            };
        }
        return {
            isAuthorized: false,
            message: "Auth Service is offline or unreachable",
            userId: null
        };
    }
};