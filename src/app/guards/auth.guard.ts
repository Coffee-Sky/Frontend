import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';

export const authGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtService);  // Usamos `inject` para acceder a los servicios
  const router = inject(Router);

  if (jwtService.tokenExistsAndValid()) {
    return true;  // Permite el acceso si el token es válido
  } else {
    router.navigate(['/login']);  // Redirige al login si el token no es válido o no existe
    return false;
  }
};
