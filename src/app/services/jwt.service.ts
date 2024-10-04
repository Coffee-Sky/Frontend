import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface token {
  exp: number;
  iat: number;
  sub: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  private readonly TOKEN_KEY = 'session_token';

  constructor() { }

  setToken(token: string): void | null {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
    else {
      return null;
    }
  }

  getToken(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  removeToken(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  tokenExistsAndValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    // Verifica si el token ha expirado (usa la lógica que ya tenías)
    const decoded: any = jwtDecode(token);
    const expiration = decoded.exp;
    const now = Date.now() / 1000;

    return expiration > now;
  }

  // Método para verificar si localStorage está disponible
  private isLocalStorageAvailable(): boolean {
    try {
      return typeof localStorage !== 'undefined' && localStorage !== null;
    } catch (e) {
      return false;
    }
  }


  decodeToken(): token | null {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }
}
