import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {AlertService} from 'ngx-alerts';
import {Alert} from '../../../../assets/alert';
// @ts-ignore
import alertJson from '../../../../assets/alert.json';
import { UserService } from 'src/app/core/service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  alertJson: Alert = alertJson;

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  // tslint:disable-next-line:max-line-length
  constructor(private userService: UserService, private router: Router, private spinner: NgxSpinnerService, private alertService: AlertService) {
  }

  get name(): any {
    return this.registerForm.get('name');
  }

  get username(): any {
    return this.registerForm.get('username');
  }

  get password(): any {
    return this.registerForm.get('password');
  }

  ngOnInit(): void {
  }

  async register(): Promise<any> {
    console.log(this.registerForm.value);
    this.spinner.show();
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      this.userService.register(this.registerForm.value).subscribe((res: any) => {
        console.log(res);
        this.registerForm.reset();
        this.router.navigate(['/sign-in/login']);
        this.spinner.hide();
      });
    } else {
      this.alertService.warning(this.alertJson.formValidateError);
      this.spinner.hide();
    }
  }
}
