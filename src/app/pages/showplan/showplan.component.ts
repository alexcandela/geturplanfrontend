import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Plan, PlanResponse, UserPlan } from '../../core/interfaces/plan';
import { PlanService } from '../../core/services/plan.service';
import { Title } from '@angular/platform-browser';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { NewlineToBrPipe } from '../../core/pipes/newline-to-br.pipe';
import { CommentComponent } from '../../components/comment/comment.component';
import { AuthService } from '../../core/services/authservice.service';
import { LikeService } from '../../core/services/like.service';
import { NotificationService } from '../../core/services/notification.service';
import { ToastComponent } from '../../components/toast-notification/toast-notification.component';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommentService } from '../../core/services/comment.service';

@Component({
  selector: 'app-showplan',
  standalone: true,
  imports: [
    DateFormatPipe,
    NewlineToBrPipe,
    CommentComponent,
    ToastComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './showplan.component.html',
  styleUrl: './showplan.component.scss'
})
export class ShowplanComponent implements OnInit {
  planId: number = 0;
  plan: Plan = {
    id: 0,
    name: '',
    description: '',
    city: '',
    province: '',
    country: '',
    likes_count: 0,
    has_liked: false,
    img: '',
    user_id: 0,
    created_at: '',
    user: {} as UserPlan,
    categories: [],
    comments: [],
    principal_image: '',
    secondary_images: [],
    url: ''
  };
  token: string | null = null;

  emptyLike: string = '/assets/icons/like_empty.svg';
  likeImg: string = '/assets/icons/like.svg';

  likeImgBtn = signal(this.emptyLike);

  logged = signal(false);

  commentForm: FormGroup;
  selectedImg: WritableSignal<string> = signal('');

  showSkeleton = signal(true);

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private titulo: Title,
    private authService: AuthService,
    private likeService: LikeService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private commentService: CommentService,
    private router: Router
  ) {
    titulo.setTitle('Ver plan');
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    });
  }

  getPlan = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      this.planService.getPlanById(this.token, this.planId).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.plan = response.plan;
            this.selectedImg.set(this.plan.img);          
            this.likeImgBtn.set(
              this.plan.has_liked ? this.likeImg : this.emptyLike
            );
            this.showSkeleton.set(false);
          }
        },
        (error) => {
          console.log(error);
          this.router.navigate(['/404']);
        }
      );
    }
  };

  checkLogged = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      if (this.token) {
        if (this.authService.isTokenValid(this.token)) {
          this.logged.set(true);
        } else {
          this.logged.set(false);
        }
      }
    } else {
      this.logged.set(false);
    }
  };

  like(event: Event) {
    event.preventDefault();
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      if (this.token) {
        if (this.authService.isTokenValid(this.token)) {
          this.likeService.toLike(this.token, this.plan.id).subscribe(
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

  selectMainImage = (img: string) => {
    this.selectedImg.set(img);
  }

  submitComment = (data: { comment: string }) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      if (this.token) {
        if (this.authService.isTokenValid(this.token)) {
          this.commentService
            .comment(this.token, this.plan.id, data.comment)
            .subscribe(
              (response) => {
                if (response.status === 'success') {
                  this.plan.comments?.unshift(response.comment);
                  this.commentForm.get('comment')?.setValue('');
                  // this.notificationService.showNotification(
                  //   'Comentario publicado correctamente.',
                  //   'success'
                  // );
                }
              },
              (error) => {
                console.error(error);
              }
            );
        } else {
          this.notificationService.showNotification(
            'Ha ocurrido un error al publicar el comentario.',
            'error'
          );
          return;
        }
      } else {
        this.notificationService.showNotification(
          'Ha ocurrido un error al publicar el comentario.',
          'error'
        );
        return;
      }
    }
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.planId = Number(params.get('id'));
      this.getPlan();
      this.checkLogged();
    });
  }
}
