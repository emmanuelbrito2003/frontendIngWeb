import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const empleadoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isEmpleado()) {
    return true;
  } else if (authService.isAuthenticated() && authService.isAdmin()) {
    // Si es admin, redirigir a dashboard de admin
    router.navigate(['/admin']);
    return false;
  } else {
    // Si no está autenticado, redirigir a login
    router.navigate(['/login']);
    return false;
  }
};