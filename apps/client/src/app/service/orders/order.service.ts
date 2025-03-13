import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../components/orders-history/order.interface';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private ORDERS_API = `${environment.apiUrlV1}/orders`;

  constructor(private http: HttpClient) { }
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.ORDERS_API}/view-order-history`, { withCredentials: true });
  }
  placeOrder(orderData: any): Observable<Order> {
    return this.http.post<Order>(`${this.ORDERS_API}/place-order`, orderData);
  }
}
