import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';

export const clientGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtService);  
  const router = inject(Router);

  if (jwtService.tokenExistsAndValid()) {
    const decodeToken = jwtService.decodeToken();
    if (decodeToken && decodeToken.role === 'ROLE_ROOT') {
      return false;
    }
    else if (decodeToken && decodeToken.role === 'ROLE_ADMIN') {
      router.navigate(['/admin']);
      return false;
    }
    else {
      // router.navigate(['/']);
      return true;
    }
  }
  router.navigate(['/login']);  // Redirige al login si el token no es válido o no existe
  return false;
};
