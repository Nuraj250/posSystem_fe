import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainComponent} from './main/main.component';
import {AuthGuard} from '../../core/guards/auth-guard';

const routes: Routes = [
  {
    path: '', component: MainComponent, canActivate: [AuthGuard], children: [
      {path: '', pathMatch: 'full', loadChildren: () => import('../order/order.module').then(m => m.OrderModule)},
      {path: 'order', loadChildren: () => import('../order/order.module').then(m => m.OrderModule)},
      {path: 'customer', loadChildren: () => import('../customer/customer.module').then(m => m.CustomerModule)},
      {path: 'item', loadChildren: () => import('../item/item.module').then(m => m.ItemModule)}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule {
}
