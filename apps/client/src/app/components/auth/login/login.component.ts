import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { z } from 'zod';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  formErrors: Record<string, string> = {};

  constructor(private fb: FormBuilder, private authService: AuthService, private toastr: ToastrService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]], // for username or email
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    // Redirect if already logged in
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      if (isAuth) {
        this.router.navigate(['/account']);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    try {
      const validatedData = loginSchema.parse(this.loginForm.value);
      this.authService.login(validatedData).subscribe({
        next: () => {
          this.toastr.success('Login successful!', 'Success');
          this.router.navigate(['/account']);
        },
        error: (error) => {
          this.toastr.error(error.error.message || 'Login failed', 'Error');
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          this.formErrors[field] = err.message;
        });
        console.error('Validation errors:', this.formErrors);
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  }

  hasError(field: string): boolean {
    return ((this.submitted || this.loginForm.get(field)?.touched) && (!!this.loginForm.get(field)?.errors || !!this.formErrors[field])) as boolean;
  }

  getErrorMessage(field: string): string {
    if (this.formErrors[field]) {
      return this.formErrors[field];
    }

    const control = this.loginForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) return 'This field is required';
    }
    return '';
  }
}

const loginSchema = z.object({
  username: z.string().min(1, 'Username or Email is required'),
  password: z.string().min(1, 'Password is required'),
});
