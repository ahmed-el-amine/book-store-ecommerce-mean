import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/homePage/header/header.component';
import { FooterComponent } from './components/homePage/footer/footer.component';
import { NgxStarsModule } from 'ngx-stars';
import { SocketService } from './services/socketIO/socket.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from './services/notification/notification.service';
import { Notification, NotificationType } from './interfaces/notification.interface';

@Component({
  imports: [RouterModule, HeaderComponent, RouterOutlet, NgxStarsModule, FooterComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private socketService: SocketService, private toastr: ToastrService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.socketService.on('notification', (data: any) => {
      const notification: Notification = JSON.parse(data);

      // Show toast notification
      switch (notification.type) {
        case 'success':
          this.toastr.success(notification.message);
          break;
        case 'error':
          this.toastr.error(notification.message);
          break;
        case 'warning':
          this.toastr.warning(notification.message);
          break;
        case 'info':
        default:
          this.toastr.info(notification.message);
          break;
      }

      this.notificationService.addNotification(notification).subscribe();
    });
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }
}
