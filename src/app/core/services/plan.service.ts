import { Injectable } from '@angular/core';
import {
  AllPlansResponse,
  Plan,
  PopularPlansResponse,
} from '../interfaces/plan';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlanFormResponse } from '../interfaces/plan-form';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPopularPlans = (
    token: string | null
  ): Observable<PopularPlansResponse> => {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<PopularPlansResponse>(`${this.apiUrl}/popular-plans`, {
      headers,
    });
  };

  getAllPlans = (
    token: string | null,
    page: number
  ): Observable<AllPlansResponse> => {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<AllPlansResponse>(
      `${this.apiUrl}/all-plans?page=${page}`,
      { headers }
    );
  };

  getFavoritePlans = (
    token: string | null,
    page: number
  ): Observable<AllPlansResponse> => {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<AllPlansResponse>(
      `${this.apiUrl}/favorite-plans?page=${page}`,
      { headers }
    );
  };

  getPlanById = (token: string | null, id: number): Observable<Plan> => {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Plan>(`${this.apiUrl}/get-plan/${id}`, { headers });
  };

  postPlan = (
    token: string | null,
    data: FormData
  ): Observable<PlanFormResponse> => {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/post-plan`, data, { headers });
  };

  deletePlan = (
    token: string | null,
    id: number
  ): Observable<any> => {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/delete-plan/${id}`, { headers });
  };

  updatePlan = (
    token: string | null,
    data: FormData,
    planId: number | undefined
  ): Observable<PlanFormResponse> => {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/update-plan/${planId}`, data, { headers });
  };

  private planSubject = new BehaviorSubject<Plan | null>(null);
  plan$ = this.planSubject.asObservable();

  setPlan(plan: Plan): void {
    this.planSubject.next(plan);
    localStorage.setItem('plan', JSON.stringify(plan));
  }

  getPlanFromLocalStorage(): Plan | null {
    const plan = localStorage.getItem('plan');
    return plan ? JSON.parse(plan) : null;
  }
}
