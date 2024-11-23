import { Component, WritableSignal, signal } from '@angular/core';
import { LoginService } from '../../core/services/login.service';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Token } from '../../core/interfaces/token';
import { UserComponent } from './user/user.component';
import { AuthService } from '../../core/services/authservice.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [UserComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  token: string | null = null;
  loggedUser: WritableSignal<boolean> = signal(false);
  userData: Object = {};

  constructor(private router: Router, private authService: AuthService) {}
  clearToken() {
    localStorage.removeItem('jwt');
    this.loggedUser.set(false);
    this.userData = {};
  }

  getUserData = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      if (this.token) {
        if (this.authService.isTokenValid(this.token)) {
          this.userData = this.authService.decodeToken(this.token);
          this.loggedUser.set(true);
          console.log(this.userData);
          
        } else {
          this.clearToken();
        }
      }
    }
  };

  ngOnInit() {
    this.getUserData();
  }
}
