import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  signIn(user: any): Observable<any> {
    return this.http.post(environment.baseUrl + '/signIn/login', user);
  }

  register(register: any): Observable<any> {
    return this.http.post(environment.baseUrl + '/signIn/register', register);
  }
}
