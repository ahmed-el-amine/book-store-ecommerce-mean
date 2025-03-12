import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, map } from 'rxjs';
import { Notification } from '../../interfaces/notification.interface';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = `${environment.apiUrlV1}/users/me/notifications`;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<Notification[]> {
    return this.http
      .get<any>(this.apiUrl, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          // Check if response has notifications property
          const notificationsArray = response.notifications || [];
          this.notificationsSubject.next(notificationsArray);
        }),
        // Map the response to extract the notifications array
        map((response) => response.notifications || [])
      );
  }

  markAsRead(id: string): Observable<any> {
    console.log('id', id);
    // For development, update mock data
    // In production, uncomment the HTTP request
    return this.http
      .patch(
        `${this.apiUrl}/${id}/read`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(() => {
          const notifications = this.notificationsSubject.value;
          const notification = notifications.find((n) => n.id === id);
          if (notification) {
            notification.isRead = true;
            this.notificationsSubject.next([...notifications]);
          }
        })
      );

    // const notifications = this.notificationsSubject.value;
    // const notification = notifications.find((n) => n.id === id);
    // if (notification) {
    //   notification.isRead = true;
    //   this.notificationsSubject.next([...notifications]);
    // }
    // return of({ success: true });
  }

  addNotification(notification: Notification): Observable<Notification> {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...currentNotifications]);
    return of(notification);
  }
}
