
export interface AuthRequest {
    phoneNumber: string; 
}

export interface AuthResponse {
    IsSucceeded: boolean;
    statusCode: number;
    message: string;

// TODO: Uncomment these fields once the Auth team updates the API contract!
// userId?: string;
// token?: string;
}