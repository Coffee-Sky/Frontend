import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { JwtService } from '../services/jwt.service';
import { Router } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  // Si el token es válido, redirige al dashboard (u otra página)
  if (jwtService.tokenExistsAndValid()) {
    router.navigate(['']);  // Redirigir a una ruta protegida si está autenticado
    return false;  // Bloquea el acceso a la página de login
  } else {
    return true;  // Permite el acceso a la página de login si no está autenticado
  }
};

