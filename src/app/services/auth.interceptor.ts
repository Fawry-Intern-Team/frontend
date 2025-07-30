// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Prevent retrying register or login endpoints
  const isAuthEndpoint = req.url.includes('/register') || req.url.includes('/login') || req.url.includes('/refresh');
  const modifiedReq = req.clone({ withCredentials: true });
  return next(modifiedReq).pipe(
    catchError(err => {
      if (err.status === 401 && !isAuthEndpoint) {
        console.log('[Interceptor] 401 caught for:', req.url);
        return authService.refresh().pipe(
          switchMap(() => next(req.clone())), // clone to re-send the request with updated token
          catchError(() => throwError(() => err))
        );
      }
      return throwError(() => err);
    })
  );
};