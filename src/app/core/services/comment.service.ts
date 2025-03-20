import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  comment = (
    token: string | null,
    planId: number,
    comment: string
  ): Observable<any> => {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = {
      comment: comment,
      planId: planId,
    };
    return this.http.post<any>(`${this.apiUrl}/comment`, { params }, { headers });
  };

  deleteComment = (
    token: string | null,
    commentId: Number
  ): Observable<any> => {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/delete-comment/${commentId}`, { headers });
  };

  reply = (
    token: string | null,
    commentId: number,
    reply: string
  ): Observable<any> => {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = {
      reply: reply,
      commentId: commentId,
    };
    return this.http.post<any>(`${this.apiUrl}/reply`, { params }, { headers });
  };

  deleteReply = (
    token: string | null,
    replyId: Number
  ): Observable<any> => {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/delete-reply/${replyId}`, { headers });
  };
}
