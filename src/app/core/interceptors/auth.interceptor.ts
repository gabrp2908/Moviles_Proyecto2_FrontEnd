import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return from(authService.getTokenAsync()).pipe(
    switchMap(token => {
      let authReq = req.clone({ withCredentials: true });
      if (token) {
        authReq = req.clone({
          withCredentials: true,
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          // Only auto-logout on 401 if NOT on an auth endpoint (login, register, etc.)
          const isAuthEndpoint = req.url.includes('/auth/');
          if (error.status === 401 && !isAuthEndpoint) {
            authService.logout();
          }
          return throwError(() => error);
        })
      );
    })
  );
};
