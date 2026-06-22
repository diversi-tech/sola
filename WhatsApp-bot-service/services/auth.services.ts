import axios from 'axios';

export const verifyUserAuth = async (authPayload: { phoneNumber: string }) => {
    const authApiUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:5005/auth/login';

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
            const { IsSucceeded, statusCode, message } = error.response.data;

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