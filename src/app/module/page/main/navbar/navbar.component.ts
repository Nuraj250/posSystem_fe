import {Component, OnInit} from '@angular/core';
import {Route, Router} from '@angular/router';
import { AppService } from 'src/app/core/service/app.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isCollapsed: any;
  name = JSON.parse(localStorage.getItem('user') as string).name;

  constructor(private appService: AppService, private router: Router) {
  }

  ngOnInit(): void {
 
  }

  toggleSidebarPin(): any {
    this.appService.toggleSidebarPin();
  }

  toggleSidebar(): any {
    this.appService.toggleSidebar();
  }

  logout(): any {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/sign-in']);
  }
}
