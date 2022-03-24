import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {Customer} from '../Customer';
import {CustomerService } from 'src/app/core/service/customer.service';
import {AlertService} from 'ngx-alerts';
import {Alert } from 'src/assets/alert';
// @ts-ignore
import alertJson from 'src/assets/alert.json';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  alertJson: Alert = alertJson;
  customerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
  });
  allCustomer: Customer[] = [];
  customerDetails: any;

  constructor(private spinner: NgxSpinnerService, private customerService: CustomerService, private alertService: AlertService) {
  }

  get name(): any {
    return this.customerForm.get('name');
  }

  get mobile(): any {
    return this.customerForm.get('mobile');
  }

  get address(): any {
    return this.customerForm.get('address');
  }

  async ngOnInit(): Promise<any> {
    await this.spinner.show();
    await this.loadAllCustomers();
    await this.spinner.hide();
  }

  async save(savebtn: HTMLButtonElement): Promise<any> {
    this.customerForm.markAllAsTouched();
    if (this.customerForm.valid) {
      if (savebtn.innerText === 'Save') {
        await this.spinner.show();
        await this.saveCustomer(savebtn);
        await this.spinner.hide();
      } else {
        await this.spinner.show();
        await this.updateCustomer(savebtn);
        await this.spinner.hide();
      }
    } else {
      this.alertService.danger(this.alertJson.formValidateError);
    }
  }

  async cancel(savebtn: HTMLButtonElement): Promise<any> {
    this.customerForm.reset();
    savebtn.innerText = 'Save';
  }

  /******************************** end cancel **********************************/


  /******************************** start save customer**********************************/
  async saveCustomer(savebtn: HTMLButtonElement): Promise<boolean> {
    return new Promise(resolve => {

      const customer = new Customer(this.name.value, this.mobile.value, this.address.value);
      this.customerService.saveCustomer(customer).subscribe((res: any) => {

        if (res.message === 'Successfully saved!') {
          this.allCustomer.push(res.object);
          this.cancel(savebtn);
          this.alertService.success(res.message);
          resolve(true);
        } else {
          this.alertService.warning(res.message);
          resolve(false);
        }

      }, (error: any) => {

        this.alertService.danger(this.alertJson.backendError);
        resolve(false);
      });
    });
  }

  /******************************** end save customer**********************************/


  /******************************** start update customer**********************************/
  async updateCustomer(savebtn: HTMLButtonElement): Promise<boolean> {
    return new Promise(resolve => {
      const customer = new Customer(this.name.value, this.mobile.value, this.address.value, this.customerDetails?.obj?.id);
      this.customerService.updateCustomer(customer).subscribe((res: any) => {

        if (res.message === 'Update Successful!') {
          this.alertService.success(res.message);
          this.allCustomer[this.customerDetails.index] = (res.object);
          this.cancel(savebtn);
          resolve(true);
        } else {
          this.alertService.danger(res.message);
          resolve(false);
        }
      }, (error: any) => {
        this.alertService.danger(this.alertJson.backendError);
        resolve(false);
      });
    });
  }

  /******************************** end update customer**********************************/


  /******************************** delete customer**********************************/
  async remove(data: Customer, i: number): Promise<any> {
    this.spinner.show();
    this.customerService.deleteCustomer(data?.id).subscribe((res: any) => {
      if (res.message === 'Removed Successful!') {

        this.allCustomer.splice(i, 1);
        this.alertService.success(res.message);
        this.spinner.hide();
      } else {
        this.alertService.warning(res.message);
        this.spinner.hide();
      }
    }, (error: any) => {
      this.alertService.danger(this.alertJson.backendError);
      this.spinner.hide();
    });
  }

  /******************************** delete customer**********************************/


  /******************************** start load customer to edit**********************************/
  async edit(data: Customer, i: number, savebtn: HTMLButtonElement, element: HTMLElement): Promise<boolean> {
    await this.spinner.show();
    return new Promise(async resolve => {
      savebtn.innerText = 'Update';

      this.customerDetails = {obj: data, index: i};

      this.name.setValue(data.name);
      this.mobile.setValue(data.mobile);
      this.address.setValue(data.address);
      element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
      await this.spinner.hide();
    });
  }

  /******************************** end load customer to edit**********************************/


  /******************************** start load all customer**********************************/
  async loadAllCustomers(): Promise<boolean> {
    return new Promise(async resolve => {
      await this.spinner.show();
      this.customerService.getCustomers().subscribe((res: any) => {

        this.allCustomer = res.object;
        resolve(true);
      }, error => {
        resolve(false);
      });
    });
  }

  /******************************** end load all customer **********************************/


}
