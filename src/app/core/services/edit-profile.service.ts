import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EditProfileForm } from '../interfaces/edit-profile-form';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EditProfileService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  editProfile = (token: string | null, formData: FormData): Observable<any> => {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<EditProfileForm>(
      `${this.apiUrl}/edit-profile`,
      formData,
      { headers }
    );
  };
}
