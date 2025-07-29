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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  keepMeLoggedIn?: boolean;
}

export interface AuthResponse {
  'Access-Token': string;
}

export interface User {
  firstName: string;
  lastName: string;
  photoURL: string;
  userId: string;
  email: string;
  roles: string[];
}