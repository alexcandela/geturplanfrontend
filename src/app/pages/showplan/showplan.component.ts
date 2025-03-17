import {
  Component,
  OnInit,
  WritableSignal,
  signal,
  ElementRef,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Plan, PlanResponse, UserPlan } from '../../core/interfaces/plan';
import { PlanService } from '../../core/services/plan.service';
import { Title, Meta } from '@angular/platform-browser';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { NewlineToBrPipe } from '../../core/pipes/newline-to-br.pipe';
import { CommentComponent } from '../../components/comment/comment.component';
import { AuthService } from '../../core/services/authservice.service';
import { LikeService } from '../../core/services/like.service';
import { NotificationService } from '../../core/services/notification.service';
import { ToastComponent } from '../../components/toast-notification/toast-notification.component';
import { Comment } from '../../core/interfaces/plan';

import { trigger, transition, style, animate } from '@angular/animations';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommentService } from '../../core/services/comment.service';
import { UserResponse } from '../../core/interfaces/user';
import { UserService } from '../../core/services/user.service';
import { Observable } from 'rxjs';
import { environment } from '../../core/environments/environment';

@Component({
  selector: 'app-showplan',
  standalone: true,
  imports: [
    DateFormatPipe,
    NewlineToBrPipe,
    CommentComponent,
    ToastComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './showplan.component.html',
  styleUrl: './showplan.component.scss',
  animations: [
    trigger('commentAnimation', [
      transition(':enter, :increment', [
        style({ opacity: 0, transform: 'translateY(-5px) scale(0.98)' }),
        animate(
          '280ms ease-out',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        ),
      ]),

      transition(':leave', [
        animate(
          '250ms ease-in-out',
          style({ opacity: 0, transform: 'scale(0.9)', height: 0 })
        ),
      ]),
    ]),
  ],
})
export class ShowplanComponent implements OnInit {
  @ViewChild('list', { static: false }) list!: ElementRef<HTMLUListElement>;
  @ViewChildren(CommentComponent)
  commentComponents!: QueryList<CommentComponent>;

  sameuser = signal(false);

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
    url: '',
  };
  token: string | null = null;

  emptyLike: string = '/assets/icons/like_empty.svg';
  likeImg: string = '/assets/icons/like.svg';

  likeImgBtn = signal(this.emptyLike);

  logged = signal(false);

  commentForm: FormGroup;
  isNewComment: boolean = false;
  selectedImg: WritableSignal<string> = signal('');

  showSkeleton = signal(true);

  userData: any;

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private titulo: Title,
    private authService: AuthService,
    private likeService: LikeService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private commentService: CommentService,
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private metaService: Meta
  ) {
    this.titulo.setTitle('Ver plan');
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    });
  }

  defaultDescription = 'Descubre planes alucinantes en Geturplan, donde puedes encontrar las mejores actividades y experiencias para disfrutar con tus amigos o familia. ¡No te pierdas ninguna aventura!' // Descripción breve por defecto


  whatsappShareUrl = '';
  facebookShareUrl = '';
  xShareUrl = '';

  sameUser(commentUserId: number): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      if (this.token) {
        if (this.authService.isTokenValid(this.token)) {
          this.userData = this.authService.decodeToken(this.token);
          if (this.userData.id === commentUserId) {
            return true;
          }
        }
      }
    }
    return false;
  }

  buildShareLink() {
    const planUrl = window.location.href;  // URL de la página actual

    // Enlace de WhatsApp (sin texto extra, solo la URL)
    this.whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(planUrl)}`;

    // Enlace de Facebook (solo la URL)
    this.facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(planUrl)}`;

    // Enlace de Twitter (X) (sin texto extra)
    this.xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(planUrl)}`;
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
            this.buildShareLink();
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
  };

  addComment(newComment: Comment) {
    this.isNewComment = true;
    newComment.has_liked = false;

    this.plan.comments = [newComment, ...(this.plan.comments ?? [])];

    // Después de agregar el nuevo comentario, actualiza el estado de todos los comentarios
    setTimeout(() => {
      this.commentComponents.forEach((commentComp) => {
        // Aquí asegúrate de que el estado de like se actualice también para los comentarios existentes
        commentComp.updateLikeState();
      });
      this.cdr.detectChanges();
    }, 0);
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
                  this.addComment(response.comment);
                  this.commentForm.get('comment')?.setValue('');
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

  handleDelete(commentId: Number) {
    this.plan.comments = this.plan.comments?.filter(
      (comment) => comment.id !== commentId
    );
  }

  compartir() {
    if (navigator.share) {
      navigator
        .share({
          url: window.location.href,
        })
        .then(() => console.log('Compartido con éxito'))
        .catch((error) => console.log('Error al compartir:', error));
    } else {
      this.notificationService.showNotification(
        'Tu navegador no es compatible',
        'warning'
      );
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.planId = Number(params.get('id'));
      this.getPlan();
      this.checkLogged();
    });
  }
}
