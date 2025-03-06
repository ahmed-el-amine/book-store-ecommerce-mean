import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isAuthenticated = false;
  currentUser: any = null;

  constructor(private authService: AuthService) {
    this.authService.isAuthenticated$.subscribe(
      (isAuth) => {
        this.isAuthenticated = isAuth;
      }
    );

    this.authService.currentUser$.subscribe(
      (user) => {
        this.currentUser = user;
      }
    );
  }
}
