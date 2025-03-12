import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../components/orders-history/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ORDERS_API = "http://localhost:3000/api/v1/orders";

  constructor(private http: HttpClient) { }
  getOrders(data: string): Observable<Order[]> {
    let params = new HttpParams();
    if (data) {
      console.log(data)
      params = params.append('status', data);
      return this.http.get<Order[]>(`${this.ORDERS_API}/view-order-history`, { params, withCredentials: true })
    }
    return this.http.get<Order[]>(`${this.ORDERS_API}/view-order-history`, { params, withCredentials: true })

  }
  placeOrder(orderData: any): Observable<Order> {
    return this.http.post<Order>(`${this.ORDERS_API}/place-order`, orderData)
  }
}
