import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../interfaces/login';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetpasswordService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  sendEmail = (data: any) => {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, data);
  };
}
