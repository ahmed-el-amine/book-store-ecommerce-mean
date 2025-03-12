import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/homePage/header/header.component';
import { FooterComponent } from './components/homePage/footer/footer.component';
import { NgxStarsModule } from 'ngx-stars';
import { SocketService } from './services/socketIO/socket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  imports: [RouterModule, HeaderComponent, RouterOutlet, NgxStarsModule, FooterComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private socketService: SocketService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.socketService.on('notification', (data: any) => {
      data = JSON.parse(data);

      switch (data.type) {
        case 'success':
          this.toastr.success(data.message);
          break;
        case 'error':
          this.toastr.error(data.message);
          break;
        case 'warning':
          this.toastr.warning(data.message);
          break;
        case 'info':
        default:
          this.toastr.info(data.message);
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }
}
