import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';

export const rootGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtService);  // Usamos `inject` para acceder a los servicios
  const router = inject(Router);

  if (jwtService.tokenExistsAndValid()) {
    const decodeToken = jwtService.decodeToken();
    if (decodeToken && decodeToken.role === 'ROLE_ROOT') {
      return true;
    }
    else if (decodeToken && decodeToken.role === 'ROLE_ADMIN') {
      router.navigate(['/admin']);
      return false;
    }
    else {
      router.navigate(['/']);
      return false;
    }
  }
  router.navigate(['/login']);  // Redirige al login si el token no es válido o no existe
  return false;
};
