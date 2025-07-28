// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError(err => {
      if (err.status === 401) {
        console.log('[Interceptor] 401 caught for:', req.url);
        return authService.refresh().pipe(
          switchMap(() => next(req)),
          catchError(() => throwError(() => err))
        );
      }
      return throwError(() => err);
    })
  );
};
