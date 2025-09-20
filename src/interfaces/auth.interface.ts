interface VarDate {
  readonly VarDate: unique symbol;
}
export interface RequestOtpRequest {
  phone_number: string;
}

export interface VerifyOtpRequest {
  phone_number: string;
  otp: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserType {
  id: string;
  phone_number: string;
  status: 'active' | 'inactive' | 'locked';
  locked_until?: Date | VarDate | null;
  login_attempts?: number;
  otp?: string | null;
  otp_expires_at?: Date | VarDate | null;
  otp_verified?: boolean;
  name: string;
  user_name: string;
  email: string;
}

export interface TokenResponse {
  access_token: string;
  user?: {
    id: string;
    name: string;
    user_name: string;
    email: string;
    phone_number: string;
    language: string;
    status: string;
  };
}

export interface UserWithPermissions {
  id: string;
  name: string;
  user_name: string;
  email: string;
  phone_number: string;
  language: string;
  status: string;
  client: {
    id: number;
    name: string;
    code: string;
  };
  role: {
    id: number;
    name: string;
  };
  permissions: string[];
}

export interface SendOtpToAnyPhoneRequest {
  phone_number: string;
}

export interface VerifyOtpForAnyPhoneRequest {
  phone_number: string;
  otp: string;
}

// New interfaces for forgot password
export interface VerifyPasswordResetOtpRequest {
  phone_number: string;
  otp: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface CheckPasswordRequest {
  username: string;
}