export enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    CONFLICT = 409,
    BAD_GATEWAY = 502,
    INTERNAL_SERVER_ERROR = 500
}

export enum AuthErrorType {
    USER_DENIED = "USER_DENIED",
    SECURITY_ERROR = "SECURITY_ERROR",
    GOOGLE_API_ERROR = "GOOGLE_API_ERROR",
    NO_REFRESH_TOKEN = "NO_REFRESH_TOKEN",
    DB_SAVE_ERROR = "DB_SAVE_ERROR",
    USER_ALREADY_ACTIVE = "USER_ALREADY_ACTIVE",
    USER_NOT_ACTIVE = "USER_NOT_ACTIVE"
}

export const authErrorStatusMap: Record<AuthErrorType, HttpStatusCode> = {
    [AuthErrorType.USER_DENIED]: HttpStatusCode.FORBIDDEN,
    [AuthErrorType.SECURITY_ERROR]: HttpStatusCode.UNAUTHORIZED,
    [AuthErrorType.GOOGLE_API_ERROR]: HttpStatusCode.BAD_GATEWAY,
    [AuthErrorType.NO_REFRESH_TOKEN]: HttpStatusCode.BAD_REQUEST,
    [AuthErrorType.DB_SAVE_ERROR]: HttpStatusCode.INTERNAL_SERVER_ERROR,
    [AuthErrorType.USER_ALREADY_ACTIVE]: HttpStatusCode.CONFLICT,
    [AuthErrorType.USER_NOT_ACTIVE]: HttpStatusCode.CONFLICT,

};