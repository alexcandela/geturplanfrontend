import {
  Component,
  Input,
  OnInit,
  signal,
  Output,
  EventEmitter,
} from '@angular/core';
import { Comment } from '../../core/interfaces/plan';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { RouterLink } from '@angular/router';
import { CommentreplyComponent } from '../commentreply/commentreply.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../core/services/authservice.service';
import { CommentService } from '../../core/services/comment.service';
import { NotificationService } from '../../core/services/notification.service';
import { UserResponse } from '../../core/interfaces/user';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [DateFormatPipe, RouterLink, CommentreplyComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent implements OnInit {
  @Input() comment!: Comment;
  @Input() sameuser?: Boolean = false;
  @Output() delete = new EventEmitter<number>();

  emptyLike: string = '/assets/icons/like_empty.svg';
  likeImg: string = '/assets/icons/like.svg';
  randomNumber: number = Math.floor(Math.random() * 20);
  token: string | null = null;
  likeImgBtn = signal(this.emptyLike);

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private commentService: CommentService,
    private userService: UserService
  ) {}


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
                  this.notificationService.showNotification(
                    'Comentario eliminado correctamente.',
                    'success'
                  );
                }
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

  ngOnInit(): void {
    console.log(this.sameuser);
  }
}
