import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Order } from './order.interface';
import { OrderService } from '../../service/orders/order.service';

@Component({
  selector: 'app-orders-history',
  imports:[CommonModule],
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss']
})
export class OrdersHistoryComponent implements OnInit  {
  
  filteredOrders:Order[]=[];
constructor(private orderService:OrderService){}
ngOnInit():void{
  this.orderService.getOrders().subscribe(
    {next:(data)=>{
      this.filteredOrders=data;
    },
    error:(err)=>console.log("Error while fetching orders",err)
})
}
  /*
  filteredOrders:Order = [
    {
      orderNumber: '235689',
      date: new Date('2024-03-15'),
      status: 'completed',
      items: [
        { 
          name: 'The Great Gatsby', 
          quantity: 2, 
          price: 29.99, 
          image: 'https://picsum.photos/100/150?random=1'
        },
        { 
          name: 'Wireless Bluetooth Headphones', 
          quantity: 1, 
          price: 149.99, 
          image: 'https://picsum.photos/100/150?random=2'
        }
      ],
      total: 209.97
    },
    {
      orderNumber: '198745',
      date: new Date('2024-02-28'),
      status: 'shipped',
      items: [
        { 
          name: 'Men\'s Running Shoes', 
          quantity: 1, 
          price: 89.99, 
          image: 'https://picsum.photos/100/150?random=3'
        }
      ],
      total: 89.99
    },
    {
      orderNumber: '203156',
      date: new Date('2024-03-10'),
      status: 'processing',
      items: [
        { 
          name: 'Stainless Steel Water Bottle', 
          quantity: 3, 
          price: 19.99, 
          image: 'https://picsum.photos/100/150?random=4'
        },
        { 
          name: 'Yoga Mat', 
          quantity: 1, 
          price: 34.99, 
          image: 'https://picsum.photos/100/150?random=5'
        }
      ],
      total: 94.96
    },
    {
      orderNumber: '189632',
      date: new Date('2024-01-05'),
      status: 'cancelled',
      items: [
        { 
          name: 'Smart Watch', 
          quantity: 1, 
          price: 199.99, 
          image: 'https://picsum.photos/100/150?random=6'
        }
      ],
      total: 199.99
    }
  ];*/

  activeFilter = 'all';
  filters = [
    { label: 'All Orders', value: 'all' },
    { label: 'Completed', value: 'completed' },
    { label: 'Processing', value: 'processing' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Shipped', value: 'shipped' }
  ];

  setFilter(filter: string) {
    this.activeFilter = filter;
    // Currently, no filtering logic is applied so all data shows.
  }

  getStatusBadgeClass(status: string) {
    return {
      'status-completed': status === 'completed',
      'status-processing': status === 'processing',
      'status-cancelled': status === 'cancelled',
      'status-shipped': status === 'shipped'
    };
  }
}
