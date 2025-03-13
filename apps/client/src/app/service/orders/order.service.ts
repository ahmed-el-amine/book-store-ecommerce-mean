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

  constructor(private http: HttpClient) {}

  getOrders(filters: any = {}, page = 1, limit = 5): Observable<any> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    // Add filters to params
    if (filters.status) params = params.set('status', filters.status);
    if (filters.sort) params = params.set('sort', filters.sort);

    return this.http.get<any>(`${this.ORDERS_API}/view-order-history`, {
      params,
      withCredentials: true,
    });
  }

  placeOrder(orderData: any): Observable<Order> {
    return this.http.post<Order>(`${this.ORDERS_API}/place-order`, orderData);
  }
}
