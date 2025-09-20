export interface GetTenantsQueryParams {
  page?: number;
  limit?: number;
}

export interface CreateTenantRequest {
  id?: string;
  name: string;
  cover_photo?: string;
  username: string;
  password: string;
  confirm_password: string;
  mobile?: string;
  email: string;
  language?: string;
  bio?: string;
  owner_name?: string;
  faculty?: any;
  offices?: any;
  youtube_link?: string;
  telegram_link?: string;
  whatsapp_link?: string;
  website_link?: string;
  instagram_link?: string;
}

export interface UpdateTenantRequest {
  id?: string;
  name?: string;
  cover_photo?: string;
  username?: string;
  password?: string;
  confirm_password?: string;
  mobile?: string;
  email?: string;
  language?: string;
  bio?: string;
  owner_name?: string;
  faculty?: any;
  offices?: any;
  youtube_link?: string;
  telegram_link?: string;
  whatsapp_link?: string;
  website_link?: string;
  instagram_link?: string;
}

export interface UpdateTenantConfigRequest {
  allow_self_registration?: boolean;
  require_approval?: boolean;
  otp_verification_required?: boolean;
  session_timeout_minutes?: number;
  allow_multiple_devices?: boolean;
  max_password_attempts?: number;
  password_expiry_days?: number;
  password_policy?: string;
  theme?: string;
}

export interface CreateTenantInput {
  id?: string;
  name: string;
  cover_photo?: string;
  username: string;
  password: string;
  confirm_password: string;
  mobile?: string;
  email: string;
  language?: string;
  bio?: string;
  owner_name?: string;
  faculty?: any;
  offices?: any;
  youtube_link?: string;
  telegram_link?: string;
  whatsapp_link?: string;
  website_link?: string;
  instagram_link?: string;
}

export interface UpdateTenantRequests {
  id?: string;
  name?: string;
  cover_photo?: string;
  username?: string;
  password?: string;
  confirm_password?: string;
  mobile?: string;
  email?: string;
  language?: any;
  bio?: string;
  owner_name?: string;
  faculty?: any;
  offices?: any;
  youtube_link?: string;
  telegram_link?: string;
  whatsapp_link?: string;
  website_link?: string;
  instagram_link?: string;
}

export interface TenantConfigInput {
  allow_self_registration?: boolean;
  require_approval?: boolean;
  otp_verification_required?: boolean;
  session_timeout_minutes?: number;
  allow_multiple_devices?: boolean;
  max_password_attempts?: number;
  password_expiry_days?: number;
  password_policy?: string;
  theme?: string;
}
