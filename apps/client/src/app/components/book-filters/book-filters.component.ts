import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookCardComponent } from '../../shared/book-card/book-card.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../../service/books/book.service';
import { AuthService } from '../../services/auth/auth.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BookEssential } from '../../interfaces/BookEssential';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-filters',
  standalone: true,
  imports: [CommonModule, BookCardComponent, ReactiveFormsModule, BsDropdownModule],
  templateUrl: './book-filters.component.html',
  styleUrl: './book-filters.component.css',
})
export class BookFiltersComponent implements OnInit {
  searchForm: FormGroup;
  filters: any = {};
  books: BookEssential[] = [];
  originalBooks: BookEssential[] = [];
  isLoading = false;

  categories: any[] = [
    { value: 'Fiction', name: 'Fiction' },
    { value: 'Science', name: 'Science' },
    { value: 'History', name: 'History' },
    { value: 'Biography', name: 'Biography' },
  ];

  userData: any;
  isAuthenticated = false;

  constructor(private fb: FormBuilder, private bookService: BookService, private authService: AuthService, private toastr: ToastrService) {
    this.searchForm = this.fb.group({
      rating: ['', [Validators.min(1), Validators.max(5)]],
      price: ['', Validators.pattern('^[0-9]*$')],
      categories: [''],
      title: [''],
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadBooks();
  }

  loadUserData(): void {
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
      if (this.isAuthenticated) {
        this.authService.currentUser$.subscribe({
          next: (user) => {
            this.userData = user;
          },
          error: (err) => {
            console.error('Error fetching user data', err);
          },
        });
      }
    });
  }

  loadBooks(): void {
    this.isLoading = true;
    this.bookService.getBooksEssential().subscribe({
      next: (response) => {
        this.books = response;
        this.originalBooks = [...response];
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load books. Please try again.');
        console.error('Error loading books', err);
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      this.isLoading = true;

      this.filters = {
        price: this.searchForm.value.price || undefined,
        rating: this.searchForm.value.rating || undefined,
        categories: this.searchForm.value.categories || undefined,
        title: this.searchForm.value.title || undefined,
      };

      // Remove undefined values
      Object.keys(this.filters).forEach((key) => this.filters[key] === undefined && delete this.filters[key]);

      this.bookService.getBooks(this.filters).subscribe({
        next: (response) => {
          this.books = response;
          this.isLoading = false;

          if (response.length === 0) {
            this.toastr.info('No books match your filters');
          }
        },
        error: (err) => {
          this.toastr.error('Error applying filters');
          console.error('Error applying filters', err);
          this.isLoading = false;
        },
      });
    }
  }

  resetFilters(): void {
    this.searchForm.reset();
    this.books = [...this.originalBooks];
    this.filters = {};
  }

  sortBooks(property: string, descending = false): void {
    this.books = [...this.books].sort((a, b) => {
      const valueA = a[property as keyof BookEssential];
      const valueB = b[property as keyof BookEssential];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return descending ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB);
      } else {
        return descending ? Number(valueB) - Number(valueA) : Number(valueA) - Number(valueB);
      }
    });

    this.toastr.success(`Books sorted by ${property}`);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.searchForm.get(controlName);
    return !!control?.invalid && (control?.touched || control?.dirty);
  }
}
