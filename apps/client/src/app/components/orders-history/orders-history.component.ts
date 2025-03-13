import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../service/orders/order.service';
import { Order } from './order.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders-history',
  imports: [CommonModule],
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss'],
})
export class OrdersHistoryComponent implements OnInit {
  allOrders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = false;

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 5;
  totalOrders = 0;
  totalPages = 0;
  hasNextPage = false;
  hasPrevPage = false;
  nextPage: number | null = null;
  prevPage: number | null = null;

  // Filters
  currentFilter = 'all';
  filters = [
    { label: 'All Orders', value: 'all' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Cancelled', value: 'Cancelled' },
    { label: 'Shipped', value: 'Shipped' },
  ];

  constructor(private orderService: OrderService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
    this.currentPage = 1;
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;

    const filters: any = {};
    if (this.currentFilter !== 'all') {
      filters.status = this.currentFilter;
    }

    this.orderService.getOrders(filters, this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        if (response && response.orders) {
          this.filteredOrders = response.orders;
          this.updatePaginationInfo(response.pagination);

          if (this.filteredOrders.length === 0 && this.currentFilter !== 'all') {
            this.toastr.info(`No ${this.currentFilter.toLowerCase()} orders found`);
          }
        } else {
          this.filteredOrders = [];
          this.toastr.error('Unexpected API response format');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Failed to load orders');
        this.isLoading = false;
      },
    });
  }

  updatePaginationInfo(pagination: any): void {
    if (pagination) {
      this.totalOrders = pagination.totalOrders || 0;
      this.totalPages = pagination.totalPages || 0;
      this.currentPage = pagination.currentPage || 1;
      this.hasNextPage = pagination.hasNextPage || false;
      this.hasPrevPage = pagination.hasPrevPage || false;
      this.nextPage = pagination.nextPage;
      this.prevPage = pagination.prevPage;
    }
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.loadOrders();
    window.scrollTo(0, 0);
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
      pageNumbers.push(-1); // Ellipsis
    } else if (startPage === 2) {
      pageNumbers.push(2);
      startPage = 3;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < this.totalPages - 1) {
      pageNumbers.push(-1); // Ellipsis
    }

    if (this.totalPages > 1) {
      pageNumbers.push(this.totalPages);
    }

    return pageNumbers;
  }
}
