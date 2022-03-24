import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 import {ItemComponent} from './item/item.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: ItemComponent},
  {path: 'item', component: ItemComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemRoutingModule { }
