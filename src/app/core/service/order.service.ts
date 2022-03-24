import {Injectable} from '@angular/core';
import {Order} from '../../module/order/Order';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) {
  }

  saveOrder(order: Order): Observable<any> {
    return this.http.post(environment.baseUrl + '/orders/save', order);
  }
}
