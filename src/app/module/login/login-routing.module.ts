import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SignInComponent} from './sign-in/sign-in.component';
import {RegisterComponent} from './register/register.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: SignInComponent},
  {path: 'login', component: SignInComponent},
  {path: 'register', component: RegisterComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {
}
