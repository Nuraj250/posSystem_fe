import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.prod';
import {Customer} from '../../module/customer/Customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) {
  }

  getCustomers(): Observable<any> {
    return this.http.get(environment.baseUrl + '/customer/getAll');
  }
  getcustomerdetails(): Observable<any> {
    return this.http.get(environment.baseUrl + '/customer/customerdetails');
  }

  saveCustomer(customer: Customer): Observable<any> {
    return this.http.post(environment.baseUrl + '/customer/save', customer);
  }

  updateCustomer(customer: Customer): Observable<any> {
    return this.http.put(environment.baseUrl + `/customer/update/${customer.id}`, customer);
  }

  deleteCustomer(id: any): Observable<any> {
    return this.http.delete(environment.baseUrl + `/customer/deleteCustomer/${id}`);
  }
}
