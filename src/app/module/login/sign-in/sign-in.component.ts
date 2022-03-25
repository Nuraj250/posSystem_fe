import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertService} from 'ngx-alerts';
import {NgxSpinnerService} from 'ngx-spinner';
import { UserService } from 'src/app/core/service/user.service';
import {User} from '../User';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private router: Router, private userService: UserService, private alertService: AlertService,
              private spinner: NgxSpinnerService) {

  }


  get username(): any {
    return this.loginForm.get('username');
  }

  get password(): any {
    return this.loginForm.get('password');
  }

  ngOnInit(): void {
  }

  async log(isRemember: boolean): Promise<any> {
    localStorage.clear();
    sessionStorage.clear();
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      const signInObject = {username: this.username.value, password: this.password.value};
      this.spinner.show();
      if (await this.login(isRemember, signInObject)) {
        this.spinner.hide();
        await this.router.navigate(['/main']);
      } else {
        this.spinner.hide();
        await this.router.navigate(['/main']);
        // this.spinner.hide();
      }
    } else {
      await this.router.navigate(['/main']);

      // this.alertService.warning('Please check the form');
    }
  }

  login(isRemember: boolean, signInObject: any): Promise<boolean> {
    return new Promise(resolve => {
      this.userService.signIn(signInObject)
        .subscribe((res: any) => {



          if (res.code === 200) {
            const data = new User(res.object.id, res.object.name, res.object.username);
            if (isRemember) {
              localStorage.setItem('user', JSON.stringify(data));
              localStorage.setItem('token', JSON.stringify(res.message));
            } else {
              sessionStorage.setItem('user', JSON.stringify(data));
              sessionStorage.setItem('token', JSON.stringify(res.message));
            }
            resolve(true);
          } else {
            this.alertService.danger(res.message);
            resolve(false);
          }
        }, (error1: any) => {

          if (error1.error.message === 'Unauthorised') {
            this.alertService.danger('Username or password incorrect!');
          } else {
            this.alertService.danger('Something went wrong!');
          }
          resolve(false);
        });
    });
  }

}
