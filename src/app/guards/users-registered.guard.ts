import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { JwtService } from '../services/jwt.service';

export const usersRegisteredGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  if(jwtService.tokenExistsAndValid()) {
    const decodeToken = jwtService.decodeToken();

    if(decodeToken && (decodeToken.role === 'ROLE_CLIENTE' || decodeToken.role === 'ROLE_ADMIN')) {
      return true;
    }
    else if(decodeToken && decodeToken.role === 'ROLE_ROOT') {
      router.navigate(['/root']);
      return false;
    }
    else {
      router.navigate(['/']);
      return false;
    }
  }
  router.navigate(['/login']); 
  return false;
};
