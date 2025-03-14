import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { ToastrService } from 'ngx-toastr';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  newRole: 'user' | 'admin' = 'user';
  isLoading = false;

  constructor(private userService: UserService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        // Transform data to map _id to id if needed
        if (Array.isArray(response)) {
          this.users = response.map(user => {
            // If server returns _id but our interface uses id
            if (user._id && !user.id) {
              return {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
              };
            }
            return user;
          });
          console.log('Transformed users:', this.users);
        } else {
          this.users = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users', error);
        this.toastr.error('Failed to load users', 'Error');
        this.isLoading = false;
      }
    });
  }

  onUserSelect(event: Event): void {
    const userId = (event.target as HTMLSelectElement).value;
    console.log('Selected userId:', userId); // Debug log

    if (userId) {
      const foundUser = this.users.find(user => user.id === userId);
      console.log('Found user:', foundUser); // Debug log

      this.selectedUser = foundUser || null;

      if (this.selectedUser) {
        // Set the new role to be the opposite of current role initially
        this.newRole = this.selectedUser.role === 'admin' ? 'user' : 'admin';
        console.log('Selected user set to:', this.selectedUser.name, 'with role:', this.selectedUser.role);
        console.log('New role set to:', this.newRole);
      }
    } else {
      this.selectedUser = null;
    }
  }

  // Simple method to set the role directly without using event
  setRole(role: 'user' | 'admin'): void {
    this.newRole = role;
  }

  updateUserRole(): void {
    if (!this.selectedUser) {
      this.toastr.warning('Please select a user first', 'Warning');
      return;
    }

    if (this.selectedUser.role === this.newRole) {
      this.toastr.info('No change in role', 'Info');
      return;
    }

    this.isLoading = true;
    this.userService.updateUserRole(this.selectedUser.id, this.newRole).subscribe({
      next: () => {
        this.toastr.success(`${this.selectedUser?.name}'s role changed to ${this.newRole}`, 'Success');

        // Update the local user data
        if (this.selectedUser) {
          this.selectedUser.role = this.newRole;
        }

        // Refresh the users list and reset selection
        this.loadUsers();
        this.selectedUser = null;

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating user role', error);
        this.toastr.error('Failed to update user role', 'Error');
        this.isLoading = false;
      }
    });
  }
}
