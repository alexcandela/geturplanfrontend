import { Component, Input, Output, signal, EventEmitter } from '@angular/core';
import { CommentReply } from '../../core/interfaces/plan';
import { RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
import { AuthService } from '../../core/services/authservice.service';
import { CommentService } from '../../core/services/comment.service';
import { ChangeDetectorRef } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';
import { LikeService } from '../../core/services/like.service';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';

@Component({
  selector: 'app-commentreply',
  standalone: true,
  imports: [RouterLink, DateFormatPipe],
  templateUrl: './commentreply.component.html',
  styleUrl: './commentreply.component.scss',
})
export class CommentreplyComponent {
  @Input() reply!: CommentReply;
  @Input() planUserId?: Number;
  @Output() deleteReplyFromArray = new EventEmitter<number>();
  @Output() responderRespuesta = new EventEmitter<String>();

  emptyLike: string = '/assets/icons/like_empty.svg';
  likeImg: string = '/assets/icons/like.svg';
  token: string | null = null;
  likeImgBtn = signal(this.emptyLike);

  sameuser = signal(false);
  userData: any;

  creador: boolean = false;

  hasLiked = signal(false);

  constructor(
    private authService: AuthService,
    private commentService: CommentService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private likeService: LikeService
  ){
  }

  checkSameUser(replyUserId: number): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      if (this.token) {
        if (this.authService.isTokenValid(this.token)) {
          this.userData = this.authService.decodeToken(this.token);
          if (this.userData.id === replyUserId) {
            return true;
          }
        }
      }
    }
    return false;
  }

  checkCredor() {
    if (this.planUserId === this.reply.user_id) {
      this.creador = true;
    }
  }

  responder(event: Event) {
    event.preventDefault();
    this.responderRespuesta.emit(this.reply.user.username);
  }

  deleteReply(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      if (this.token) {
        if (this.authService.isTokenValid(this.token)) {
          this.commentService
            .deleteReply(this.token, this.reply.id)
            .subscribe(
              (response) => {
                if (response.status === 'success') {
                  this.deleteReplyFromArray.emit(this.reply.id); 
                }
                this.cdr.detectChanges();
              },
              (error) => {
                console.error(error);
                this.notificationService.showNotification(
                  'Error al eliminar la respuesta',
                  'error'
                );
              }
            );
        } else {
          this.notificationService.showNotification(
            'Error al eliminar la respuesta',
            'error'
          );
          return;
        }
      } else {
        this.notificationService.showNotification(
          'Error al borrar la respuesta',
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
          this.likeService.toLikeCommentReply(this.token, this.reply.id).subscribe(
            (response) => {
              if (response.status === 'success') {
                this.hasLiked.set(response.message);
                this.reply.has_liked = response.message;
                this.likeImgBtn.set(
                  this.likeImgBtn() === this.emptyLike
                    ? this.likeImg
                    : this.emptyLike
                );
                if (
                  this.reply.likes_count === undefined ||
                  this.reply.likes_count === null
                ) {
                  this.reply.likes_count = 0;
                }
                this.reply.likes_count = response.message
                  ? this.reply.likes_count + 1
                  : this.reply.likes_count - 1;
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

  updateLikeState() {
    this.likeImgBtn.set(this.reply.has_liked ? this.likeImg : this.emptyLike);
    this.hasLiked.set(this.reply.has_liked);
  }

  trackByReplyId(index: number, reply: CommentReply): number {
      return reply.id; // O cualquier identificador único del comentario
    }

  ngOnInit(): void {
    this.updateLikeState();
    this.sameuser.set(this.checkSameUser(this.reply.user_id));
    this.checkCredor(); 
  }
}
