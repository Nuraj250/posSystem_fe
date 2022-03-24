import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.prod';
import {Item} from '../../module/item/Item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) {
  }

  getAllItems(): Observable<any> {
    return this.http.get(environment.baseUrl + '/item/getAll');
  }

  saveItem(item: any): Observable<any> {
    return this.http.post(environment.baseUrl + '/item/save', item);
  }

  updateItem(item: Item): Observable<any> {
    return this.http.put(environment.baseUrl + `/item/update/${item.id}`, item);
  }

  deleteItem(id: any): Observable<any> {
    return this.http.delete(environment.baseUrl + `/item/deleteItem/${id}`);
  }
}
