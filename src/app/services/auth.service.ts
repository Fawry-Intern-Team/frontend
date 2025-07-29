import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthConfig, LoginRequest, RegisterRequest, AuthResponse, User } from '../models';

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
  private currentUser: User | null = null;

  constructor(
    private http: HttpClient,
    @Optional() @Inject('AUTH_CONFIG') authConfig?: AuthConfig
  ) {
    this.config = authConfig || DEFAULT_AUTH_CONFIG;
  }


  setUser(user: User) {
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user)); // optional
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles.includes(role) ?? false;
  }

  register(data: RegisterRequest): Observable<User> {
    data.keepMeLoggedIn = true;
    return this.http.post<User>(
      `${this.config.baseUrl}${this.config.registerPath}`,
      data,
      { withCredentials: true }
    );
  }

  login(data: LoginRequest): Observable<User> {
    return this.http.post<User>(
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
    // Clear local user info
    localStorage.removeItem('user');
  
    // Optionally: clear memory-stored user
    this.currentUser = null;
  
    // Redirect to login or landing page
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