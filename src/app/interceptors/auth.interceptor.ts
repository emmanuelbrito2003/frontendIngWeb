import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('🌐 Interceptor - URL:', req.url);
  console.log('🔑 Token presente:', !!token);

  // No agregar token a rutas de autenticación
  if (req.url.includes('/auth/')) {
    console.log('🔓 Ruta de autenticación detectada');
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error en petición de autenticación:', error);
        console.error('📊 Status:', error.status);
        console.error('📝 Mensaje:', error.message);
        console.error('🔗 URL:', error.url);
        return throwError(() => error);
      })
    );
  }

  // Si hay token, agregarlo al header
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(authReq);
  }

  return next(req);
};
