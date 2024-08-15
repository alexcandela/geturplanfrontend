import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../../core/interfaces/plan';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [DateFormatPipe, RouterLink],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent implements OnInit {
  @Input() comment!: Comment;
  
  ngOnInit(): void {
    
  }  
}
