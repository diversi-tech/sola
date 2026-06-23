import {AuthErrorType}from '../types/authErrors.enum.js';

export class AppError extends Error {
  public statusCode: AuthErrorType;

  constructor(message: string, statusCode: AuthErrorType) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name; 
    Error.captureStackTrace(this, this.constructor);
  }
}