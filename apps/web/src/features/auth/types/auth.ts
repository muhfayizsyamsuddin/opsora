export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface LoginResponse {
  access_token: string;
  token_type: "Bearer";
  refresh_token: string;
  user: User;
}

export interface RefreshResponse {
  access_token: string;
  token_type: "Bearer";
  refresh_token: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface UpdateProfileResponse {
  id: string;
  name: string;
  email: string;
  role: string | null;
  roleId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}