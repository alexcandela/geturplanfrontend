import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PlanService } from '../../core/services/plan.service';
import { Plan, PopularPlansResponse } from '../../core/interfaces/plan';
import { PlanComponent } from '../../components/plan/plan.component';
import { AuthService } from '../../core/services/authservice.service';
import { ToastComponent } from '../../components/toast-notification/toast-notification.component';
import { CommonModule } from '@angular/common';
import { Notification } from '../../core/interfaces/notification';
import { NotificationService } from '../../core/services/notification.service';
import { SkeletonPlanComponent } from '../../components/skeleton-plan/skeleton-plan.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PlanComponent, ToastComponent, SkeletonPlanComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {

  popularPlans: WritableSignal<Plan[]> = signal([]);
  token: string | null = null;
  loading = signal(true);
  mesActual: WritableSignal<string> = signal('');

  constructor(
    private titulo: Title,
    private service: PlanService,
    private notificationService: NotificationService
  ) {
    titulo.setTitle('Home');
  }

  defMesActual(): void {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const now = new Date();
    this.mesActual.set(months[now.getMonth()]);
  }

  getPlans = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      this.service.getPopularPlans(this.token).subscribe(
        (response: PopularPlansResponse) => {
          if (response.status === 'success') {
            this.popularPlans.set(response.plans);
            this.loading.set(false);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  ngOnInit(): void {
    this.defMesActual();
    this.getPlans();
  }
}
