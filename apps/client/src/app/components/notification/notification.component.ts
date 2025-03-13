import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../services/notification/notification.service';
import { Notification, NotificationType } from '../../interfaces/notification.interface';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, BsDropdownModule, ModalModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount = 0;
  modalRef?: BsModalRef;
  selectedNotification?: Notification;

  constructor(private notificationService: NotificationService, private modalService: BsModalService) {}

  ngOnInit(): void {
    this.loadNotifications();

    // Subscribe to new notifications
    this.notificationService.notifications$.subscribe((notifications) => {
      if (Array.isArray(notifications)) {
        this.notifications = notifications;
        this.updateUnreadCount();
      }
    });
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.updateUnreadCount();
      },
      error: (error) => {
        console.error('Error loading notifications', error);
      },
    });
  }

  updateUnreadCount(): void {
    // Fix the condition - it was checking if length exists, not if it's zero
    if (!this.notifications || !Array.isArray(this.notifications) || this.notifications.length === 0) {
      this.unreadCount = 0;
      return;
    }
    this.unreadCount = this.notifications.filter((n) => !n.isRead).length;
  }

  markAsRead(notification: Notification, template: any): void {
    this.selectedNotification = notification;

    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.isRead = true;
          this.updateUnreadCount();
        },
        error: (error) => {
          console.error('Error marking notification as read', error);
        },
      });
    }

    this.modalRef = this.modalService.show(template);
  }

  getNotificationIcon(type: NotificationType | undefined): string {
    switch (type) {
      case NotificationType.SUCCESS:
        return 'bi bi-check-circle-fill text-success';
      case NotificationType.ERROR:
        return 'bi bi-x-circle-fill text-danger';
      case NotificationType.WARNING:
        return 'bi bi-exclamation-triangle-fill text-warning';
      case NotificationType.INFO:
      default:
        return 'bi bi-info-circle-fill text-info';
    }
  }

  getNotificationClass(type: NotificationType): string {
    switch (type) {
      case NotificationType.SUCCESS:
        return 'notification-success';
      case NotificationType.ERROR:
        return 'notification-error';
      case NotificationType.WARNING:
        return 'notification-warning';
      case NotificationType.INFO:
      default:
        return 'notification-info';
    }
  }
}
