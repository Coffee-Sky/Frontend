import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';

export const authGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  const decodeToken = jwtService.decodeToken();

  if (decodeToken) {
    if (decodeToken.role === 'ROLE_ROOT') {
      router.navigate(['/root']);
      return false;  // Bloquea el acceso a esta ruta, ya que el root tiene su propia vista
    } else if (decodeToken.role === 'ROLE_ADMIN') {
      router.navigate(['/admin']);
      return false;  // Bloquea el acceso a esta ruta, redirige al área de admin
    }
    // Si es un usuario registrado y no admin o root, permite continuar
    return true; 
  }

  // Si no hay token válido, permite el acceso a rutas públicas (login, register)
  return true;
};
