import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = JSON.parse(sessionStorage.getItem('token') as string) || JSON.parse(localStorage.getItem('token') as string);
    if (token) {
      return true;
    } else if (state.url === '/main') {
      return true;
    } else {
      this.router.navigate(['/main']);
      return true;
    }
  }
}
