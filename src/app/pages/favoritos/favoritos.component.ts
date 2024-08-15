import { Component, OnInit, signal } from '@angular/core';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { PlanComponent } from '../../components/plan/plan.component';
import { ToastComponent } from '../../components/toast-notification/toast-notification.component';
import { AuthService } from '../../core/services/authservice.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AllPlansResponse, Plan } from '../../core/interfaces/plan';
import { SkeletonPlanComponent } from '../../components/skeleton-plan/skeleton-plan.component';
import { PlanService } from '../../core/services/plan.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [
    PaginationComponent,
    PlanComponent,
    ToastComponent,
    SkeletonPlanComponent,
  ],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.scss',
})
export class FavoritosComponent implements OnInit {
  plans: Plan[] = [];
  token: string | null = null;

  loading = signal(true);
  cant = signal(10);

  currentPage = signal(1);
  plansPerPage = signal(8);
  totalPlans = signal(0);

  constructor(
    private titulo: Title,
    private authService: AuthService,
    private router: Router,
    private planService: PlanService
  ) {
    titulo.setTitle('Favoritos');
  }

  checkLogged = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('jwt');
      if (!token || !this.authService.isTokenValid(token)) {
        this.router.navigate(['/login']);
      }
    }
  };

  getFavoritePlans = (page: number) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      this.planService.getFavoritePlans(this.token, page).subscribe(
        (response: AllPlansResponse) => {
          if (response.status === 'success') {
            this.plans = response.plans.data;
            this.totalPlans.set(response.plans.total);
            this.loading.set(false);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.getFavoritePlans(this.currentPage());
  }

  ngOnInit(): void {
    this.checkLogged();
    this.getFavoritePlans(this.currentPage());
  }
}
