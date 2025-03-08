import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AddressFormComponent } from './address-form/address-form.component';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, AddressFormComponent],
  template: `
    <div class="card">
      <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
        <h5 class="card-title mb-0">My Addresses</h5>
        <button class="btn btn-primary" (click)="showAddressForm()"><i class="bi bi-plus-lg me-2"></i>Add New Address</button>
      </div>
      <div class="card-body">
        <!-- Loading State -->
        <div class="text-center py-5" *ngIf="loading">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- No Addresses State -->
        <div class="text-center py-5" *ngIf="!loading && (!addresses || addresses.length === 0)">
          <p class="text-muted mb-0">No addresses found. Add your first address!</p>
        </div>

        <!-- Addresses List -->
        <div class="row g-4" *ngIf="!loading && addresses.length > 0">
          <div class="col-12 col-md-6 col-lg-4" *ngFor="let address of addresses">
            <div class="card h-100 shadow-sm" [class.border-primary]="address.isDefault">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1">
                    <!-- Default Address Badge -->
                    <div class="mb-2" *ngIf="address.isDefault">
                      <span class="badge bg-primary">Default Address</span>
                    </div>
                    <!-- Address Details -->
                    <p class="mb-1 text-body-secondary"><strong>Street:</strong> {{ address.street }}</p>
                    <p class="mb-1 text-body-secondary"><strong>City:</strong>{{ address.city }}</p>
                    <p class="mb-1 text-body-secondary"><strong>State:</strong>{{ address.state }}</p>
                    <p class="mb-1 text-body-secondary"><strong>zipCode:</strong>{{ address.zipCode }}</p>
                    <p class="mb-1 text-body-secondary"><strong>Country:</strong>{{ address.country }}</p>
                  </div>
                  <div class="dropdown">
                    <button class="btn btn-light btn-sm rounded-circle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li>
                        <button class="dropdown-item" (click)="editAddress(address)"><i class="bi bi-pencil me-2"></i>Edit</button>
                      </li>
                      <!-- <li>
                        <button class="dropdown-item" *ngIf="!address.isDefault"><i class="bi bi-star me-2"></i>Set as Default</button>
                      </li> -->
                      <li>
                        <button class="dropdown-item text-danger" (click)="deleteAddress(address._id)"><i class="bi bi-trash me-2"></i>Delete</button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Address Form Modal -->
    <app-address-form *ngIf="showModal" [address]="selectedAddress" (close)="closeAddressForm()" (save)="onAddressSaved()"> </app-address-form>
  `,
  styles: [
    `
      .card-body {
        position: relative;
      }
      .dropdown {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
      }
      .badge {
        font-size: 0.75rem;
      }
    `,
  ],
})
export class AddressesComponent implements OnInit {
  addresses: any[] = [];
  loading = false;
  showModal = false;
  selectedAddress: any = null;

  constructor(private authService: AuthService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.loading = true;
    this.authService.getAddresses().subscribe({
      next: (data) => {
        this.addresses = data.address;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error.error?.message || 'Failed to load addresses');
        this.loading = false;
      },
    });
  }

  showAddressForm(): void {
    this.selectedAddress = null;
    this.showModal = true;
  }

  editAddress(address: any): void {
    this.selectedAddress = address;
    this.showModal = true;
  }

  closeAddressForm(): void {
    this.showModal = false;
    this.selectedAddress = null;
  }

  onAddressSaved(): void {
    this.showModal = false;
    this.selectedAddress = null;
    this.loadAddresses();
  }

  deleteAddress(addressId: string): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.authService.deleteAddress(addressId).subscribe({
        next: () => {
          this.toastr.success('Address deleted successfully');
          this.loadAddresses();
        },
        error: (error) => {
          this.toastr.error(error.error?.message || 'Failed to delete address');
        },
      });
    }
  }
}
