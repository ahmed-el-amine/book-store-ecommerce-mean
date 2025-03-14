import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../environment';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrlV1 + '/users';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<any>(`${this.apiUrl}`, { withCredentials: true })
    .pipe(
      tap((response: any) => {
        console.log('Raw API response:', response);
      }),
      // Simple map to transform object to array
      map((response: any): User[] => {
        // If it's already an array, return it
        if (response?.users && Array.isArray(response.users)) {
          return response.users;
        }
        // Default to empty array if nothing else works
        return [];
      })
    );
  }


  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/role/${userId}`, { role }, { withCredentials: true });
  }
}
