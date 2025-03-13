import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../service/orders/order.service';
import { Order } from './order.interface';

@Component({
  selector: 'app-orders-history',
  imports: [CommonModule],
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss'],
})
export class OrdersHistoryComponent implements OnInit {
  allOrders: Order[] = [];
  filteredOrders: Order[] = [];


  constructor(private orderService: OrderService) { }
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