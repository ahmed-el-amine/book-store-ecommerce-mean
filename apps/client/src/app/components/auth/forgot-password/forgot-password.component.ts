import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private toastr: ToastrService, private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) return;

    this.loading = true;
    const { email } = this.forgotPasswordForm.value;

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.toastr.success('Password reset instructions have been sent to your email');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(error.error?.message || 'Failed to process request');
        this.loading = false;
      },
    });
  }

  hasError(field: string): boolean {
    const control = this.forgotPasswordForm.get(field);
    return !!(control?.invalid && (control?.touched || control?.dirty));
  }

  getErrorMessage(field: string): string {
    const control = this.forgotPasswordForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['email']) return 'Please enter a valid email address';
    }
    return '';
  }
}
