import {
  ChangeDetectorRef,
  Component,
  OnInit,
  WritableSignal,
  signal,
} from '@angular/core';
import { Input } from '@angular/core';
import { Plan } from '../../core/interfaces/plan';
import { LikeService } from '../../core/services/like.service';
import { AuthService } from '../../core/services/authservice.service';
import { NotificationService } from '../../core/services/notification.service';
import { Route, Router, RouterLink } from '@angular/router';
import { PlanService } from '../../core/services/plan.service';

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.scss',
})
export class PlanComponent implements OnInit {
  @Input() plan!: Plan;
  @Input() sameuser?: Boolean = false;

  emptyLike: string = '/assets/icons/like_empty.svg';
  likeImg: string = '/assets/icons/like.svg';

  likeImgBtn = signal(this.emptyLike);

  token: string | null = null;
  showModal = signal(false);

  constructor(
    private service: LikeService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private planService: PlanService
  ) {}

  like(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      if (this.token) {
        if (this.authService.isTokenValid(this.token)) {
          this.service.toLike(this.token, this.plan.id).subscribe(
            (response) => {
              if (response.status === 'success') {
                this.likeImgBtn.set(
                  this.likeImgBtn() === this.emptyLike
                    ? this.likeImg
                    : this.emptyLike
                );
                this.plan.likes_count = response.message
                  ? this.plan.likes_count + 1
                  : this.plan.likes_count - 1;
              }
            },
            (error) => {
              console.error(error);
            }
          );
        } else {
          this.notificationService.showNotification(
            'Inicia sesión para utilizar esta función.',
            'error'
          );
          return;
        }
      } else {
        this.notificationService.showNotification(
          'Inicia sesión para utilizar esta función.',
          'error'
        );
        return;
      }
    }
  }

  edit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      if (this.token) {
        if (this.authService.isTokenValid(this.token)) {
          this.planService.setPlan(this.plan);
          this.router.navigate(['/editar-plan']);
        } else {
          this.notificationService.showNotification('Error al editar', 'error');
          return;
        }
      } else {
        this.notificationService.showNotification('Error al editar', 'error');
        return;
      }
    }
  };

  delete = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      if (this.token) {
        if (this.authService.isTokenValid(this.token)) {
          this.showModal.set(true);
        } else {
          this.notificationService.showNotification(
            'Error al borrar el plan',
            'error'
          );
          return;
        }
      } else {
        this.notificationService.showNotification(
          'Error al borrar el plan',
          'error'
        );
        return;
      }
    }
  };

  cancelar = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      if (this.token) {
        if (this.authService.isTokenValid(this.token)) {
          this.showModal.set(false);
        } else {
          this.notificationService.showNotification('Error', 'error');
          return;
        }
      } else {
        this.notificationService.showNotification('Error', 'error');
        return;
      }
    }
  };

  confirmar = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      if (this.token) {
        if (this.authService.isTokenValid(this.token)) {
          this.planService.deletePlan(this.token, this.plan.id).subscribe(
            (response) => {
              if (response.status === 'success') {
                this.notificationService.showNotification(
                  'Plan eliminado correctamente.',
                  'success'
                );
                setTimeout(function() {
                  location.reload();
              }, 3000);
              
              }
            },
            (error) => {
              console.error(error);
            }
          );
        } else {
          this.notificationService.showNotification(
            'Error al borrar el plan',
            'error'
          );
          return;
        }
      } else {
        this.notificationService.showNotification(
          'Error al borrar el plan',
          'error'
        );
        return;
      }
    }
  };

  checkLiked = () => {
    this.likeImgBtn.set(this.plan.has_liked ? this.likeImg : this.emptyLike);
  };

  ngOnInit(): void {
    this.checkLiked();
  }

  ngOnChanges(): void {
    this.checkLiked();
    this.cdr.detectChanges();
  }
}
