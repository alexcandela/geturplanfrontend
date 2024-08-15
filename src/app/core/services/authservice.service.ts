import { Injectable } from '@angular/core';
import {jwtDecode, JwtPayload } from 'jwt-decode';
import { Token } from '../interfaces/token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isTokenValid(token: string): boolean {
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      if (!decodedToken.exp) {
        return false;
      }
      const expiryTime = decodedToken.exp * 1000;
      const currentTime = Date.now();
      return expiryTime > currentTime;
    } catch (error) {
      return false;
    }
  }

  decodeToken(token: string): { id: string; username: string } | {} {
    try {
      const decodedToken = jwtDecode<Token>(token);
      return { id: decodedToken.id, username: decodedToken.username };
    } catch (error) {
      return {};
    }
  }
}
