import { Injectable } from '@angular/core';
import { Filtro } from '../interfaces/filtro';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AllPlansResponse } from '../interfaces/plan';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BuscadorService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  
  buscar = (
    token: string | null,
    page: number,
    filtro: any
  ): Observable<AllPlansResponse> => {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const categoriasStr = filtro.categorias.join(',');

    const params = {
      page: page.toString(),
      value: filtro.value || '',
      categorias: categoriasStr,
      provincia: filtro.provincia || '',
      ordenar: filtro.ordenar || false,
    };
    return this.http.get<AllPlansResponse>(`${this.apiUrl}/buscar`, {
      headers,
      params,
    });
  };
}
