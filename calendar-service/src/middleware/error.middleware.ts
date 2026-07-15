import { AuthErrorType, authErrorStatusMap, HttpStatusCode } from '../types/authErrors.enum.js';
import { Request, Response, NextFunction } from 'express';

const DEFAULT_HTTP_STATUS = 500;

export class CalendarServiceError extends Error {
	public statusCode: AuthErrorType;
	constructor(message: string, statusCode: AuthErrorType) {
		super(message);
		this.statusCode = statusCode;
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}


export class BadRequestError extends Error {
	statusCode: number;
	constructor(message: string) {
		super(message);
		this.statusCode = 400;
		Object.setPrototypeOf(this, BadRequestError.prototype);
	}
}


interface AppError extends Error {
	status?: number;
	statusCode?: number | AuthErrorType;
	details?: any;
}

const AUTH_ERROR_HTTP_STATUS: Record<AuthErrorType, number> = {
	[AuthErrorType.USER_DENIED]: 403,
	[AuthErrorType.SECURITY_ERROR]: 400,
	[AuthErrorType.GOOGLE_API_ERROR]: 502,
	[AuthErrorType.NO_REFRESH_TOKEN]: 400,
	[AuthErrorType.DB_SAVE_ERROR]: DEFAULT_HTTP_STATUS,
};

function resolveHttpStatus(rawStatus: unknown): number {
	if (typeof rawStatus === 'number' && Number.isInteger(rawStatus)) {
		return rawStatus;
	}

	if (typeof rawStatus === 'string' && rawStatus in AUTH_ERROR_HTTP_STATUS) {
		return AUTH_ERROR_HTTP_STATUS[rawStatus as AuthErrorType];
	}

	return DEFAULT_HTTP_STATUS;
}

export default function errorHandler(
	err: AppError | any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	let status: number;

	if (err instanceof CalendarServiceError) {
		status = authErrorStatusMap[err.statusCode] ?? HttpStatusCode.INTERNAL_SERVER_ERROR;
	} else if (typeof err?.statusCode === 'number') {
		status = err.statusCode;
	} else if (typeof err?.status === 'number') {
		status = err.status;
	} else {
		status = HttpStatusCode.INTERNAL_SERVER_ERROR;
	}

	const message = err?.message || 'Internal Server Error';

	console.error('[Error]', {
		message,
		status,
		stack: err?.stack,
		details: err?.details ?? err,
	});

	const payload: any = {
		success: false,
		error: {
			message,
		},
	};

	if (process.env.NODE_ENV !== 'production') {
		payload.error.stack = err?.stack;
		if (err?.details) payload.error.details = err.details;
	}

	res.status(status).json(payload);
}

export const catchAsync = (
	fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};