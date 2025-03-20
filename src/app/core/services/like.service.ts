import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  toLike = (token: string | null, planId: number): Observable<any> => {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/like`, {planId}, { headers });
  }

  toLikeComment = (token: string | null, commentId: number): Observable<any> => {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/comment-like`, {commentId}, { headers });
  }

  // toLikeCommentReply = (token: string | null, replyId: number): Observable<any> => {
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   return this.http.post<any>(`${this.apiUrl}/reply-like`, {replyId}, { headers });
  // }

}
