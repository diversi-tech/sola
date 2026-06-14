import axios from 'axios';

export const verifyUserAuth = async (authPayload: { phoneNumber: string }) => {
    const authApiUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:5005/auth/verify-phone';

    try {
        console.log(`Sending auth request to Auth Service for: ${authPayload.phoneNumber}...`);

        const response = await axios.post(authApiUrl, authPayload);

        const { IsSucceeded, message } = response.data;
        console.log(`Auth success: ${message}`);

        return {
            isAuthorized: IsSucceeded,
            message: message
        };

    } catch (error: any) {
        if (error.response) {
            const { IsSucceeded, statusCode, message } = error.response.data;
            console.log(`Auth Service responded with status ${statusCode}: ${message}`);

            return {
                isAuthorized: IsSucceeded,
                message: message
            };
        }

        console.error("Cannot reach Auth Service:", error.message);
        return {
            isAuthorized: false,
            message: "Auth Service is offline or unreachable"
        };
    }
};