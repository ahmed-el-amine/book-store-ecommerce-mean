import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { z } from 'zod';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  submitted = false;
  formErrors: Record<string, string> = {};

  constructor(private fb: FormBuilder, private authService: AuthService, private toastr: ToastrService, private router: Router) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      phone: ['', [Validators.pattern(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/)]],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.formErrors = {};

    if (this.signupForm.invalid) {
      this.toastr.error('Please check your form inputs', 'Validation Error');
      return;
    }

    try {
      const validatedData = createUserSchema.parse(this.signupForm.value);
      this.authService.signup(validatedData).subscribe({
        next: () => {
          this.toastr.success('Account created successfully you can login now!', 'Success');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.toastr.error(error.error.message || 'Registration failed', 'Error');
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          this.formErrors[field] = err.message;
        });
        this.toastr.error('Please check your form inputs', 'Validation Error');
      } else {
        this.toastr.error('An unexpected error occurred', 'Error');
      }
    }
  }

  hasError(field: string): boolean {
    return ((this.submitted || this.signupForm.get(field)?.touched) && (!!this.signupForm.get(field)?.errors || !!this.formErrors[field])) as boolean;
  }

  getErrorMessage(field: string): string {
    if (this.formErrors[field]) {
      return this.formErrors[field];
    }

    const control = this.signupForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['email']) return 'Please enter a valid email address';
      if (control.errors['pattern'] && field === 'phone') return 'Invalid phone number format';
    }
    return '';
  }
}

const addressSchema = z
  .object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
    isDefault: z.boolean().default(false),
  })
  .strip();

const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/);

const baseUser = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string(),
    lastName: z.string(),
    address: z.array(addressSchema).optional(),
    email: z.string().email('Please provide a valid email address'),
    phone: z.string().regex(phoneRegex, 'Invalid Number!').or(z.literal('')).optional(),
  })
  .strip();

const createUserSchema = baseUser.omit({ address: true }).strip();
