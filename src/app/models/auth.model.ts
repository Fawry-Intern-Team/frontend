// Auth Models and Interfaces

export interface AuthConfig {
  baseUrl: string;
  loginRedirectPath: string;
  registerRedirectPath: string;
  googleOAuthPath: string;
  refreshPath: string;
  loginPath: string;
  registerPath: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  keepMeLoggedIn: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword?: string;
  keepMeLoggedIn?: boolean;
  roles?: string[];
}

export interface AuthResponse {
  'Access-Token': string;
}

export interface User {
  id?: string;
  email: string;
  roles?: string[];
  isAuthenticated?: boolean;
} 