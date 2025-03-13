import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OrderService } from '../../service/orders/order.service';
import { Order } from './order.interface';

@Component({
  selector: 'app-orders-history',
  imports: [CommonModule],
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss'],
})
export class OrdersHistoryComponent {
  filteredOrders!: Order[];
  constructor(private orderService: OrderService) {}

  filters = [
    { label: 'All Orders', value: 'all' },
    { label: 'Completed', value: 'completed' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Shipped', value: 'shipped' },
  ];

  setFilter(filter: string) {
    this.orderService.getOrders(filter).subscribe({
      next: (response) => {
        console.log(response);

        this.filteredOrders = response;

        console.log(filter);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getStatusBadgeClass(status: string) {
    return {
      'status-completed': status === 'completed',
      'status-processing': status === 'processing',
      'status-cancelled': status === 'cancelled',
      'status-shipped': status === 'shipped',
    };
  }
}
