import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageRoutingModule } from './page-routing.module';
import { MainComponent } from './main/main.component';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import { NavbarComponent } from './main/navbar/navbar.component';


@NgModule({
  declarations: [MainComponent, SidebarComponent, NavbarComponent],
  imports: [
    CommonModule,
    PageRoutingModule
  ]
})
export class PageModule { }
