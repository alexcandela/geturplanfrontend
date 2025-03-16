import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../core/interfaces/plan';
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

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [DateFormatPipe, RouterLink, CommentreplyComponent],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnChanges {
  @Input() comment!: Comment;
  @Input() sameuser?: Boolean = false;
  @Output() delete = new EventEmitter<number>();

  emptyLike: string = '/assets/icons/like_empty.svg';
  likeImg: string = '/assets/icons/like.svg';
  token: string | null = null;
  likeImgBtn = signal(this.emptyLike);
  hasLiked = signal(false);

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private commentService: CommentService,
    private likeService: LikeService,
    private cdr: ChangeDetectorRef
  ) {}
  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comment'] && this.comment) {
      this.updateLikeState();
    }
  }

  updateLikeState() {
    this.likeImgBtn.set(
      this.comment.has_liked ? this.likeImg : this.emptyLike
    );
    this.hasLiked.set(this.comment.has_liked);
    console.log(this.hasLiked());
    
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
        
                this.likeImgBtn.set(
                  this.likeImgBtn() === this.emptyLike
                    ? this.likeImg
                    : this.emptyLike
                );
                if (this.comment.likes_count === undefined || this.comment.likes_count === null) {
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

  ngOnInit(): void {
    console.log(this.comment.replies);
    this.updateLikeState();
  }
}
