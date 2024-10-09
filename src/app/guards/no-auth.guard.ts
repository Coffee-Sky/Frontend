import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { JwtService } from '../services/jwt.service';
import { Router } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  if (jwtService.tokenExistsAndValid()) {
    const decodeToken = jwtService.decodeToken();

    // Si es root o admin, redirige a sus respectivas áreas
    if (decodeToken && decodeToken.role === 'ROLE_ROOT') {
      router.navigate(['/root']);
    } else if (decodeToken && decodeToken.role === 'ROLE_ADMIN') {
      router.navigate(['/info']);
    } else {
      router.navigate(['/']);  // Redirige a la página principal si está autenticado
    }
    return false;
  }
  
  return true;  // Permite el acceso a la página de login si no está autenticado
};
