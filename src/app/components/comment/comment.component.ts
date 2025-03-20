import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Comment, CommentReply } from '../../core/interfaces/plan';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { RouterLink } from '@angular/router';
import { CommentreplyComponent } from '../commentreply/commentreply.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../core/services/authservice.service';
import { CommentService } from '../../core/services/comment.service';
import { NotificationService } from '../../core/services/notification.service';
import { LikeService } from '../../core/services/like.service';
import { ChangeDetectorRef } from '@angular/core';
import { signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    DateFormatPipe,
    RouterLink,
    CommentreplyComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  animations: [
    trigger('replyAnimation', [
      // Animación al entrar o al agregar un nuevo elemento
      transition(':enter, :increment', [
        style({ opacity: 0, transform: 'translateY(-5px) scale(0.98)' }),
        animate(
          '280ms ease-out',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        ),
      ]),

      // Animación cuando un elemento sale
      transition(':leave', [
        animate(
          '250ms ease-in-out',
          style({ opacity: 0, transform: 'scale(0.9)', height: 0 })
        ),
      ]),
    ]),
  ],
})
export class CommentComponent implements OnChanges {
  @Input() comment!: Comment;
  @Input() sameuser?: Boolean = false;
  @Input() planUserId?: Number;
  @Output() delete = new EventEmitter<number>();

  @ViewChildren(CommentreplyComponent)
  replyComponents!: QueryList<CommentreplyComponent>;

  emptyLike: string = '/assets/icons/like_empty.svg';
  likeImg: string = '/assets/icons/like.svg';
  token: string | null = null;
  likeImgBtn = signal(this.emptyLike);
  hasLiked = signal(false);
  inputReply = signal(false);

  logged = signal(false);
  replyForm: FormGroup;

  isNewReply: boolean = false;

  hasReplies = signal(false);

  creador: boolean = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private commentService: CommentService,
    private likeService: LikeService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.replyForm = this.fb.group({
      reply: ['', Validators.required],
    });
  }

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

  checkCredor() {
    if (this.planUserId === this.comment.user_id) {
      this.creador = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comment'] && this.comment) {
      this.updateLikeState();
    }
  }

  updateLikeState() {
    this.likeImgBtn.set(this.comment.has_liked ? this.likeImg : this.emptyLike);
    this.hasLiked.set(this.comment.has_liked);
  }

  deleteComment(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      if (this.token) {
        if (this.authService.isTokenValid(this.token)) {
          this.commentService
            .deleteComment(this.token, this.comment.id)
            .subscribe(
              (response) => {
                if (response.status === 'success') {
                  this.delete.emit(this.comment.id);
                }
                this.cdr.detectChanges();
              },
              (error) => {
                console.error(error);
                this.notificationService.showNotification(
                  'Error al eliminar el comentario',
                  'error'
                );
              }
            );
        } else {
          this.notificationService.showNotification(
            'Error al eliminar el comentario',
            'error'
          );
          return;
        }
      } else {
        this.notificationService.showNotification(
          'Error al borrar el comentario',
          'error'
        );
        return;
      }
    }
  }

  like(event: Event) {
    event.preventDefault();
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      if (this.token) {
        if (this.authService.isTokenValid(this.token)) {
          this.likeService.toLikeComment(this.token, this.comment.id).subscribe(
            (response) => {
              if (response.status === 'success') {
                this.hasLiked.set(response.message);
                this.comment.has_liked = response.message;
                this.likeImgBtn.set(
                  this.likeImgBtn() === this.emptyLike
                    ? this.likeImg
                    : this.emptyLike
                );
                if (
                  this.comment.likes_count === undefined ||
                  this.comment.likes_count === null
                ) {
                  this.comment.likes_count = 0;
                }
                this.comment.likes_count = response.message
                  ? this.comment.likes_count + 1
                  : this.comment.likes_count - 1;
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

  toggleInputReply() {
    if (this.logged()) {
      this.inputReply.set(!this.inputReply());
    } else {
      this.notificationService.showNotification(
        'Inicia sesión para utilizar esta función.',
        'error'
      );
    }
  }

  submitReply = (data: { reply: string }) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      if (this.token) {
        if (this.authService.isTokenValid(this.token)) {
          this.commentService
            .reply(this.token, this.comment.id, data.reply)
            .subscribe(
              (response) => {
                if (response.status === 'success') {
                  this.replyForm.get('reply')?.setValue('');
                  this.inputReply.set(false);
                  this.addReply(response.reply);
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

  addReply(newReply: CommentReply) {
    this.isNewReply = true;
    this.hasReplies.set(true);
    this.comment.replies.push(newReply);

    this.comment.replies = [...this.comment.replies];

    this.cdr.detectChanges();

    if (this.replyComponents && this.replyComponents.length === 0) {
      this.cdr.detectChanges();
    } else {
      this.replyComponents.toArray().forEach((replyComp) => {});
    }
  }

  handleDelete(replyId: Number) {
    this.comment.replies = this.comment.replies?.filter(
      (reply) => reply.id !== replyId
    );
  }

  responderRespuesta(username: String) {
    this.inputReply.set(true);
    this.replyForm.patchValue({ reply: `@${username} ` });
  }  

  ngOnInit(): void {
    this.updateLikeState();
    this.checkLogged();
    this.hasReplies.set(this.comment.has_replies);
    this.checkCredor();
    console.log(this.hasLiked);
    
  }
}
