import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../core/services/login.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  constructor(private service: LoginService, private router: Router) {}

  @Input() userData: any;
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout = () => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      return;
    }
    this.service.logout(token).subscribe(
      (response) => {
        if (response.status === 'success') {
          console.log(response);
          localStorage.removeItem('jwt');
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  };
}
