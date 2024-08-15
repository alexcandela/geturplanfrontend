import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryResponse } from '../interfaces/category';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCategories = (): Observable<CategoryResponse> => {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/categories`);
  }
}
