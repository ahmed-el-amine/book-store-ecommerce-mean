import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{address ? 'Edit' : 'Add'}} Address</h5>
              <button type="button" class="btn-close" (click)="onClose()" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form [formGroup]="addressForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="street" class="form-label">Street Address</label>
                  <input type="text" id="street" class="form-control" formControlName="street"
                    [class.is-invalid]="isFieldInvalid('street')" placeholder="Street address">
                  <div class="invalid-feedback">{{getErrorMessage('street')}}</div>
                </div>
                <div class="row mb-3">
                  <div class="col-md-6 mb-3 mb-md-0">
                    <label for="city" class="form-label">City</label>
                    <input type="text" id="city" class="form-control" formControlName="city"
                      [class.is-invalid]="isFieldInvalid('city')" placeholder="City">
                    <div class="invalid-feedback">{{getErrorMessage('city')}}</div>
                  </div>
                  <div class="col-md-6">
                    <label for="state" class="form-label">State</label>
                    <input type="text" id="state" class="form-control" formControlName="state"
                      [class.is-invalid]="isFieldInvalid('state')" placeholder="State">
                    <div class="invalid-feedback">{{getErrorMessage('state')}}</div>
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-md-6 mb-3 mb-md-0">
                    <label for="zipCode" class="form-label">ZIP Code</label>
                    <input type="text" id="zipCode" class="form-control" formControlName="zipCode"
                      [class.is-invalid]="isFieldInvalid('zipCode')" placeholder="ZIP code">
                    <div class="invalid-feedback">{{getErrorMessage('zipCode')}}</div>
                  </div>
                  <div class="col-md-6">
                    <label for="country" class="form-label">Country</label>
                    <input type="text" id="country" class="form-control" formControlName="country"
                      [class.is-invalid]="isFieldInvalid('country')" placeholder="Country">
                    <div class="invalid-feedback">{{getErrorMessage('country')}}</div>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="form-check">
                    <input type="checkbox" id="isDefault" class="form-check-input" formControlName="isDefault">
                    <label class="form-check-label" for="isDefault">Set as default address</label>
                  </div>
                </div>
                <div class="text-end">
                  <button type="button" class="btn btn-secondary me-2" (click)="onClose()">Cancel</button>
                  <button type="submit" class="btn btn-primary" [disabled]="loading || addressForm.invalid">
                    <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
                    {{loading ? 'Saving...' : 'Save Address'}}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1050;
    }
    .modal-backdrop {
      z-index: 1051;
    }
    .modal {
      z-index: 1052;
    }
  `]
})
export class AddressFormComponent implements OnInit {
  @Input() address: any;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  addressForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private toastr: ToastrService) {
    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
      isDefault: [false]
    });
  }

  ngOnInit(): void {
    if (this.address) {
      this.addressForm.patchValue(this.address);
    }
  }

  onSubmit(): void {
    if (this.addressForm.invalid) return;

    this.loading = true;
    const addressData = this.addressForm.value;

    const request = this.address 
      ? this.authService.updateAddress(this.address._id, addressData) 
      : this.authService.addAddress(addressData);

    request.subscribe({
      next: () => {
        this.toastr.success(`Address ${this.address ? 'updated' : 'added'} successfully`);
        this.save.emit();
      },
      error: (error) => {
        this.toastr.error(error.error?.message || `Failed to ${this.address ? 'update' : 'add'} address`);
        this.loading = false;
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.addressForm.get(field);
    return !!(control?.invalid && (control?.touched || control?.dirty));
  }

  getErrorMessage(field: string): string {
    const control = this.addressForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['pattern']) return 'Invalid format';
    }
    return '';
  }
}
