import { Component, Input, OnInit, Renderer2 } from '@angular/core';
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
export class UserComponent implements OnInit{
  constructor(private service: LoginService, private router: Router, private renderer: Renderer2) {}

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

  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.dropdown') as HTMLElement;
    const dropdownToggle = document.querySelector('.userComp-name') as HTMLElement;

    if (dropdown && !dropdown.contains(target) && !dropdownToggle.contains(target)) {
      this.dropdownOpen = false;
    }
  }

  ngOnInit(): void {
    this.renderer.listen('document', 'click', (event) => this.handleClickOutside(event));
  }
}