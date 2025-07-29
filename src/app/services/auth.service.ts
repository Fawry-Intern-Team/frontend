import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthConfig, LoginRequest, RegisterRequest, AuthResponse } from '../models';

const DEFAULT_AUTH_CONFIG: AuthConfig = {
  baseUrl: 'http://localhost:8080',
  loginRedirectPath: '/dashboard',
  registerRedirectPath: '/login',
  googleOAuthPath: '/oauth2/authorization/google',
  refreshPath: '/auth/refresh',
  loginPath: '/auth/login',
  registerPath: '/auth/register'
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private config: AuthConfig;

  constructor(
    private http: HttpClient,
    @Optional() @Inject('AUTH_CONFIG') authConfig?: AuthConfig
  ) {
    this.config = authConfig || DEFAULT_AUTH_CONFIG;
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.config.baseUrl}${this.config.registerPath}`,
      data,
      { withCredentials: true }
    );
  }

  login(data: LoginRequest): Observable<void> {
    return this.http.post<void>(
      `${this.config.baseUrl}${this.config.loginPath}`,
      data,
      { withCredentials: true }
    );
  }


  refresh(): Observable<void> {
    console.log('[AuthService] Refreshing token...');
    return this.http.get<void>(
      `${this.config.baseUrl}${this.config.refreshPath}`,
      { withCredentials: true }
    );
  }


  googleLogin(): void {
    window.location.href = `${this.config.baseUrl}${this.config.googleOAuthPath}`;
  }

  getLoginRedirectPath(): string {
    return this.config.loginRedirectPath;
  }

  getRegisterRedirectPath(): string {
    return this.config.registerRedirectPath;
  }

  logout(): void {
    window.location.href = this.config.loginRedirectPath;
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get(`${this.config.baseUrl}/auth/protected`, { withCredentials: true, responseType: 'text' }).pipe(
      tap({
        next: () => console.log('Auth check success'),
        error: err => console.log('Auth check failed', err)
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }


} 