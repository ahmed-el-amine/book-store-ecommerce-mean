import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1/auth';
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      {
        headers: this.headers,
        withCredentials: true,
      }
    );
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/me`, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/users/me`, {
      headers: this.headers,
      withCredentials: true,
    });
  }
}
