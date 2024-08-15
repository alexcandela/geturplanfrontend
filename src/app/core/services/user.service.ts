import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserPlansResponse, UserResponse } from '../interfaces/user';
import { Observable } from 'rxjs';
import { AllPlansResponse } from '../interfaces/plan';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getUser = (
    token: string | null,
    username: string
  ): Observable<UserResponse> => {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<UserResponse>(`${this.apiUrl}/get-user/${username}`, {
      headers,
    });
  };
  getUserPlans(
    token: string | null,
    page: number,
    username: string
  ): Observable<UserPlansResponse> {
    // Configurar los encabezados
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Configurar los parámetros de consulta
    const params = new HttpParams()
      .set('page', page.toString())
      .set('username', username);

    // Realizar la solicitud HTTP GET
    return this.http.get<UserPlansResponse>(`${this.apiUrl}/get-user-plans`, {
      headers,
      params,
    });
  }
}
