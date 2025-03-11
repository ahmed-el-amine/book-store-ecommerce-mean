import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  loading = false;
  token = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.resetForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
    if (!this.token) {
      this.toastr.error('Invalid reset link');
      this.router.navigate(['/auth/login']);
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid) return;

    this.loading = true;
    const { newPassword } = this.resetForm.value;

    this.authService.resetPassword({ newPassword, token: this.token }).subscribe({
      next: () => {
        this.toastr.success('Password reset successful');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.toastr.error(error.error?.message || 'Failed to reset password');
        this.loading = false;
      },
    });
  }

  hasError(field: string): boolean {
    const control = this.resetForm.get(field);
    return !!(control?.invalid && (control?.touched || control?.dirty));
  }

  getErrorMessage(field: string): string {
    if (field === 'confirmPassword' && this.resetForm.hasError('mismatch')) {
      return 'Passwords do not match';
    }

    const control = this.resetForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['minlength']) return 'Password must be at least 6 characters';
    }
    return '';
  }
}
