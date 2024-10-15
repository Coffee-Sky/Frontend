import { HttpInterceptorFn } from '@angular/common/http';
import { JwtService } from '../jwt.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('session_token');

  const cloneRequest = token 
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(cloneRequest);
};
