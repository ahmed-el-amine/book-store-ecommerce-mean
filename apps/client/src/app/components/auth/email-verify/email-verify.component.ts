import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-email-verify',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col-md-6 text-center">
          @if (loading) {
          <div class="spinner-container">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Verifying your email...</p>
          </div>
          } @else if (error) {
          <div class="alert alert-danger">
            {{ error }}
          </div>
          <a class="btn btn-primary" routerLink="/auth/login">Go to Login</a>
          } @else if (verified) {
          <div class="alert alert-success">
            <i class="bi bi-check-circle-fill me-2"></i>
            Email verified successfully!
          </div>
          <p>You can now login to your account.</p>
          <a class="btn btn-primary" routerLink="/auth/login">Go to Login</a>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .spinner-container {
        padding: 2rem;
      }
      .alert {
        padding: 1rem;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class EmailVerifyComponent implements OnInit {
  loading = true;
  verified = false;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  ngOnInit() {
    const token = this.route.snapshot.params['token'];
    if (!token) {
      this.error = 'Invalid verification link';
      this.loading = false;
      return;
    }

    this.verifyEmail(token);
  }

  private verifyEmail(token: string) {
    this.authService.verifyEmail({ token }).subscribe({
      next: () => {
        this.loading = false;
        this.verified = true;
        this.toastr.success('Email verified successfully');
      },
      error: (error) => {
        this.loading = false;
        const message = error.error?.message || 'Failed to verify email';
        this.toastr.error(message);
      },
    });
  }
}
