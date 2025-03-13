import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OrderService } from '../../service/orders/order.service';
import { Order } from './order.interface';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-orders-history',
  imports: [CommonModule],
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss'],
})
export class OrdersHistoryComponent {
  allOrders: Order[] = [];
  filteredOrders: Order[] = [];


  constructor(private orderService: OrderService, private authService: AuthService) { }
  filters = [
    { label: 'All Orders', value: 'all' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Cancelled', value: 'Cancelled' },
    { label: 'Shipped', value: 'Shipped' },
  ];

  ngOnInit(): void {
    this.loadOrders()
  }
  setFilter(filter: string) {
    this.filteredOrders = filter === 'all'
      ? this.allOrders
      : this.allOrders.filter(order => order.status === filter);
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (response) => {
        console.log(response);
        this.allOrders = response;
        this.filteredOrders = response;

      },
      error: (error) => {
        console.log(error);
      },
    });
  }


}