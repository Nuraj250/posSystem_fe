import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order/order.component';
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [OrderComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', 
    }),
    ReactiveFormsModule,
  ]
})
export class OrderModule { }
