import { Component, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  User,
  UserPlansResponse,
  UserResponse,
} from '../../core/interfaces/user';
import { AllPlansResponse, Plan } from '../../core/interfaces/plan';
import { UserService } from '../../core/services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlanComponent } from '../../components/plan/plan.component';
import { ToastComponent } from '../../components/toast-notification/toast-notification.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { SkeletonPlanComponent } from '../../components/skeleton-plan/skeleton-plan.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [PaginationComponent, PlanComponent, ToastComponent, SkeletonPlanComponent, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  user: User = {
    username: '',
    email: '',
    description: '',
    img: '',
    instagram: '',
    facebook: '',
    tiktok: '',
  };
  plans: Plan[] = [];
  username: string = '';
  token: string | null = null;
  sameuser = signal(false);
  loading = signal(true);
  loadingPlans = signal(true);

  currentPage = signal(1);
  plansPerPage = signal(3);
  totalPlans = signal(0);

  constructor(
    private titulo: Title,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    titulo.setTitle('Perfil');
  }

  defDescription = () => {
    if (this.user.description === null) {
      this.user.description = 'Sin descripción.';
    }
  };

  getUser = (username: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      this.userService.getUser(this.token, username).subscribe(
        (response: UserResponse) => {
          if (response.status === 'success') {
            this.user = response.user;
            this.sameuser.set(response.sameuser);
            this.defDescription();
            this.loading.set(false);
            this.userService.setUser(response.user);
          }
        },
        (error) => {
          console.log(error);
          this.router.navigate(['/404']);
        }
      );
    }
  };

  getUserPlans = (page: number, username: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      this.userService.getUserPlans(this.token, page, username).subscribe(
        (response: UserPlansResponse) => {
          if (response.status === 'success') { 
            this.plans = response.plans.data;
            this.totalPlans.set(response.plans.total);
            this.loadingPlans.set(false);
            
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  getPlansForPage(page: number): Plan[] {
    const startIndex = (page - 1) * this.plansPerPage();
    const endIndex = startIndex + this.plansPerPage();
    return this.plans.slice(startIndex, endIndex);
  }

  updateCurrentPageAlEliminar = (currentPage: number) => {
    const plansForCurrentPage = this.getPlansForPage(currentPage);
    if (plansForCurrentPage.length === 0 && currentPage > 1) {
      this.currentPage.set(currentPage - 1);
      this.getUserPlans(this.currentPage(), this.username);
    } else {
      this.getUserPlans(this.currentPage(), this.username);
    }
  }

  eliminarPlan = (id: number) => {
    this.plans = this.plans.filter(plan => plan.id !== id);
    this.updateCurrentPageAlEliminar(this.currentPage());
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.getUserPlans(this.currentPage(), this.username);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const newUsername = params.get('username') ?? '';
      if (this.username !== newUsername) {
        this.username = newUsername;
        this.getUser(this.username);
        this.getUserPlans(this.currentPage(), this.username);
      }
    });
  }
}
