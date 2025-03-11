import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AddressesComponent } from './addresses/addresses.component';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AddressesComponent],
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css'],
})
export class AccountSettingsComponent implements OnInit {
  activeTab = 'profile';
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  loading = false;
  user: any = null;
  constructor(private fb: FormBuilder, private authService: AuthService, private toastr: ToastrService, private router: Router) {
    this.initializeForms();
  }
  private initializeForms() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/)]],
    });
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }
  private passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value ? null : { notMatching: true };
  }
  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      if (!isAuth) {
        this.router.navigate(['/auth/login']);
        return;
      }

      this.authService.currentUser$.subscribe((user) => {
        if (user) {
          this.user = user;
          this.profileForm.patchValue({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
          });
        }
      });
    });
  }
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  onProfileSubmit(): void {
    if (this.profileForm.invalid) {
      this.toastr.error('Please check your form inputs', 'Validation Error');
      return;
    }

    // Get only changed values
    const formValues = this.profileForm.value;
    const changedValues: any = {};
    let hasChanges = false;

    // Check each field for changes
    Object.keys(formValues).forEach((key) => {
      if (formValues[key] !== this.user[key] && formValues[key] !== '') {
        changedValues[key] = formValues[key];
        hasChanges = true;
      }
    });

    // If no changes, show message and return
    if (!hasChanges) {
      this.toastr.info('No changes detected', 'Info');
      return;
    }

    this.loading = true;
    this.authService.updateProfile(changedValues).subscribe({
      next: () => {
        this.toastr.success('Profile updated successfully', 'Success');
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error.error?.message || 'Failed to update profile', 'Error');
        this.loading = false;
      },
    });
  }
  onPasswordSubmit(): void {
    if (this.passwordForm.invalid) {
      this.toastr.error('Please check your form inputs', 'Validation Error');
      return;
    }
    this.loading = true;
    const passwordData = {
      currentPassword: this.passwordForm.get('currentPassword')?.value,
      newPassword: this.passwordForm.get('newPassword')?.value,
    };
    this.authService.changePassword(passwordData).subscribe({
      next: () => {
        this.toastr.success('Password changed successfully', 'Success');
        this.passwordForm.reset();
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error.error?.message || 'Failed to change password', 'Error');
        this.loading = false;
      },
    });
  }
  hasError(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!(control?.invalid && (control?.touched || control?.dirty));
  }
  getErrorMessage(form: FormGroup, field: string): string {
    const control = form.get(field);
    if (control?.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['email']) return 'Please enter a valid email address';
      if (control.errors['minlength']) return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
      if (control.errors['pattern'] && field === 'phone') return 'Invalid phone number format';
    }
    return '';
  }
}
