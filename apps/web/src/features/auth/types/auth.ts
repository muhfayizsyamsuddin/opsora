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