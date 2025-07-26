import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  } else if (authService.isAuthenticated() && authService.isEmpleado()) {
    // Si es empleado, redirigir a su perfil
    router.navigate(['/profile']);
    return false;
  } else {
    // Si no está autenticado, redirigir a login
    router.navigate(['/login']);
    return false;
  }
};
