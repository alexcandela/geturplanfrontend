import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Register } from '../interfaces/register';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;
  login = (data: Register, options: any) => {
    return this.http.post<Register>(`${this.apiUrl}/register`, data);
  }
}
