import { Component, Input, signal } from '@angular/core';
import { CommentReply } from '../../core/interfaces/plan';
import { RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-commentreply',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './commentreply.component.html',
  styleUrl: './commentreply.component.scss',
})
export class CommentreplyComponent {
  @Input() reply!: CommentReply;

  emptyLike: string = '/assets/icons/like_empty.svg';
  likeImg: string = '/assets/icons/like.svg';
  token: string | null = null;
  likeImgBtn = signal(this.emptyLike);

  constructor(){
  }

  ngOnInit(): void {
    console.log(this.reply);
  }
}
