import axios from 'axios';

export const verifyUserAuth = async (authPayload: { phone_number: string }) => {
    const authApiUrl = process.env.AUTH_SERVICE_URL;

    if (!authApiUrl) {
        throw new Error("AUTH_SERVICE_URL is not defined in environment variables");
    }

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