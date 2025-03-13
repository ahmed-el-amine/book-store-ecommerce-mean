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
  isLoading = false;

  currentPage = 1;
  itemsPerPage = 6;
  totalBooks = 0;
  totalPages = 0;
  hasNextPage = false;
  hasPrevPage = false;
  nextPage: number | null = null;
  prevPage: number | null = null;

  categories: any[] = [
    { value: 'Fiction', name: 'Fiction' },
    { value: 'Science', name: 'Science' },
    { value: 'History', name: 'History' },
    { value: 'Biography', name: 'Biography' },
  ];

  userData: any;
  isAuthenticated = false;

  sortValue: string | null = null;
  sortDirection = false;

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

    this.bookService.getBooks({}, this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        if (response && response.books) {
          this.books = response.books;
          this.updatePaginationInfo(response.pagination);
        } else {
          this.books = [];
          this.toastr.error('Unexpected API response format');
          console.error('Unexpected API response format:', response);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load books. Please try again.');
        console.error('Error loading books', err);
        this.isLoading = false;
      },
    });
  }

  updatePaginationInfo(pagination: any): void {
    if (pagination) {
      this.totalBooks = pagination.totalBooks || 0;
      this.totalPages = pagination.totalPages || 0;
      this.currentPage = pagination.currentPage || 1;
      this.hasNextPage = pagination.hasNextPage || false;
      this.hasPrevPage = pagination.hasPrevPage || false;
      this.nextPage = pagination.nextPage;
      this.prevPage = pagination.prevPage;
    }
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      this.isLoading = true;
      this.currentPage = 1;

      this.filters = {
        price: this.searchForm.value.price || undefined,
        rating: this.searchForm.value.rating || undefined,
        categories: this.searchForm.value.categories || undefined,
        title: this.searchForm.value.title || undefined,
      };

      Object.keys(this.filters).forEach((key) => this.filters[key] === undefined && delete this.filters[key]);

      if (this.sortValue) {
        this.filters.sort = this.sortDirection ? `-${this.sortValue}` : this.sortValue;
      }

      this.bookService.getBooks(this.filters, this.currentPage, this.itemsPerPage).subscribe({
        next: (response) => {
          if (response && response.books) {
            this.books = response.books;
            this.updatePaginationInfo(response.pagination);

            if (this.books.length === 0) {
              this.toastr.info('No books match your filters');
            }
          } else {
            this.books = [];
            this.toastr.error('Unexpected API response format');
          }
          this.isLoading = false;
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
    this.filters = {};
    this.sortValue = null;
    this.sortDirection = false;
    this.currentPage = 1;
    this.loadBooks();
  }

  sortBooks(property: string, descending = false): void {
    this.sortValue = property;
    this.sortDirection = descending;
    this.filters.sort = descending ? `-${property}` : property;
    this.currentPage = 1;

    this.bookService.getBooks(this.filters, this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        if (response && response.books) {
          this.books = response.books;
          this.updatePaginationInfo(response.pagination);
          this.toastr.success(`Books sorted by ${property}`);
        } else {
          this.toastr.error('Error sorting books');
        }
      },
      error: (err) => {
        this.toastr.error('Error sorting books');
        console.error('Error sorting books', err);
      },
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.isLoading = true;

    this.bookService.getBooks(this.filters, this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        if (response && response.books) {
          this.books = response.books;
          this.updatePaginationInfo(response.pagination);
          window.scrollTo(0, 0);
        } else {
          this.toastr.error('Error loading page');
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error('Error loading page');
        console.error('Error loading page', err);
        this.isLoading = false;
      },
    });
  }

  getPageNumbers(): number[] {
    const pageNumbers: number[] = [];
    const maxVisiblePages = 7;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    pageNumbers.push(1);

    const sidePages = Math.floor((maxVisiblePages - 3) / 2);
    let startPage = Math.max(2, this.currentPage - sidePages);
    let endPage = Math.min(this.totalPages - 1, this.currentPage + sidePages);

    if (this.currentPage <= 3) {
      endPage = Math.min(maxVisiblePages - 1, this.totalPages - 1);
    } else if (this.currentPage >= this.totalPages - 2) {
      startPage = Math.max(2, this.totalPages - maxVisiblePages + 2);
    }

    if (startPage > 2) {
      pageNumbers.push(-1);
    } else if (startPage === 2) {
      pageNumbers.push(2);
      startPage = 3;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < this.totalPages - 1) {
      pageNumbers.push(-1);
    }

    if (this.totalPages > 1) {
      pageNumbers.push(this.totalPages);
    }

    return pageNumbers;
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.searchForm.get(controlName);
    return !!control?.invalid && (control?.touched || control?.dirty);
  }
}
