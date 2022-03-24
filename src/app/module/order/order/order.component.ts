import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Customer} from '../../customer/Customer';
import {NgxSpinnerService} from 'ngx-spinner';
import {Item} from '../../item/Item';
import {AlertService} from 'ngx-alerts';
import {SelectedItem} from '../SelectedItem';
// @ts-ignore
import alertJson from '../../../../assets/alert.json';
import {Alert} from '../../../../assets/alert';
import {CustomerForOrder, ItemForOrder, Order} from '../Order';
import { CustomerService } from 'src/app/core/service/customer.service';
import { ItemService } from 'src/app/core/service/item.service';
import { OrderService } from 'src/app/core/service/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  alertJson: Alert = alertJson;

  orderForm = new FormGroup({
    itemname: new FormControl('select', [Validators.required, Validators.pattern('^(?!select$).*$')]),
    itemId: new FormControl('', [Validators.required]),
    quantity: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$') && Validators.pattern('^(?!0$).*$')]),
    unitprice: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
    subtotal: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$') && Validators.pattern('^(?!0$).*$')]),
    quantityonHand: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
  });


  allCustomer: Customer[] = [];
  allItems: Item[] = [];
  quantgreaterthanqoh = false;
  allSelectedItems: SelectedItem[] = [];
  placeOrderForm = new FormGroup({
    name: new FormControl('select', [Validators.required, Validators.pattern('^(?!select$).*$')]),
    totalamount: new FormControl(0, [Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
    discount: new FormControl(0, [Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
    grandtotal: new FormControl(0, [Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')])
  });

  customerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
  });
  get cus_name(): any {
    return this.customerForm.get('name');
  }

  get cus_mobile(): any {
    return this.customerForm.get('mobile');
  }

  get cus_address(): any {
    return this.customerForm.get('address');
  }

  constructor(private spinner: NgxSpinnerService, private itemService: ItemService, private customerService: CustomerService,
              private alertService: AlertService, private orderService: OrderService) {
  }

  get name(): any {
    return this.placeOrderForm.get('name');
  }

  get subtotal(): any {
    return this.orderForm.get('subtotal');
  }

  get totalamount(): any {
    return this.placeOrderForm.get('totalamount');
  }

  get itemname(): any {
    return this.orderForm.get('itemname');
  }

  get quantityonHand(): any {
    return this.orderForm.get('quantityonHand');
  }

  get discount(): any {
    return this.placeOrderForm.get('discount');
  }

  get grandtotal(): any {
    return this.placeOrderForm.get('grandtotal');
  }

  get unitprice(): any {
    return this.orderForm.get('unitprice');
  }

  get quantity(): any {
    return this.orderForm.get('quantity');
  }

  async ngOnInit(): Promise<any> {
    await this.spinner.show();
    await this.loadAllCustomers();
    await this.loadAllItems();
    await this.spinner.hide();
  }

  /****************************** save or update***********************************/
  async save(savebtn: HTMLButtonElement): Promise<any> {
    this.orderForm.markAllAsTouched();


    if (this.orderForm.valid) {
      if (savebtn.innerText === 'Save') {
        await this.saveItemLocally(savebtn);
      } else {
        await this.updateCustomer(savebtn);
      }
    } else {
      if (this.quantgreaterthanqoh === true) {
        this.alertService.warning('Quantity out of range');
      } else {
        this.alertService.warning(this.alertJson.formValidateError);
      }

    }
  }

  /****************************** end of save or update **************************/

  /****************************** start cancel**************************/
  async cancel(savebtn: HTMLButtonElement): Promise<any> {
    this.orderForm.reset();
    this.customerForm.reset();
    savebtn.innerText = 'Add to cart';
  }

  /****************************** end cancel **************************/

  /****************************** start save to cart **************************/
  async saveItemLocally(savebtn: HTMLButtonElement): Promise<boolean> {
    return new Promise(async resolve => {
      await this.savetotable(savebtn);

      resolve(true);
    });
  }

  /****************************** end save to cart **************************/


  /****************************** start updte customer**************************/
  async updateCustomer(savebtn: HTMLButtonElement): Promise<boolean> {
    return new Promise(async (resolve: any) => {
      await this.savetotable(savebtn);
      resolve(true);
    });
  }

  /****************************** end update customer **************************/


  /****************************** start order remove from cart**************************/
  async remove(data: SelectedItem, i: number): Promise<any> {
    this.totalamount.setValue(this.totalamount.value - data.sub_total);
    this.grandtotal.setValue(this.grandtotal.value - data.sub_total);
    this.allSelectedItems.splice(i, 1);

  }

  /****************************** end order remove from cart**************************/

  /****************************** start order edit from cart**************************/
  async edit(data: SelectedItem, i: number, savebtn: HTMLButtonElement, element: HTMLElement): Promise<boolean> {
    return new Promise(async resolve => {

      savebtn.innerText = 'Update cart';
      this.itemname.setValue(data.name);
      this.quantity.setValue(data.qty);
      this.unitprice.setValue(data.unit_price);
      this.subtotal.setValue(data.sub_total);
      await this.loadItemDetails();
      element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    });
  }

  /****************************** end order edit from cart**************************/

  /****************************** start load all customer to combo**************************/
  async loadAllCustomers(): Promise<boolean> {
    return new Promise(async resolve => {
      await this.spinner.show();
      this.customerService.getcustomerdetails().subscribe((res: any) => {

        this.allCustomer = res.object;
        resolve(true);
      }, error => {
        resolve(false);
      });
    });
  }

  /****************************** end load all customer to combo**************************/
  /****************************** start place order**************************/
  async placeOrder(): Promise<any> {
    this.placeOrderForm.markAllAsTouched();
    if (this.placeOrderForm.valid) {
      await this.saveOrderToDB();
    } else {
      this.alertService.warning(this.alertJson.formValidateError);
    }
  }

  /****************************** end place order**************************/
  /****************************** start load all items**************************/
  async loadAllItems(): Promise<boolean> {
    return new Promise(async resolve => {
      this.itemService.getAllItems().subscribe(res => {

        this.allItems = res.object;
        resolve(true);
      }, error => {
        resolve(false);
      });
    });
  }

  /****************************** end load all items**************************/

  /****************************** start change item in combo**************************/
  async changeItem(event: any): Promise<any> {

    await this.loadItemDetails();
  }

  /****************************** end change item in combo**************************/


  /****************************** start calculate subtotal**************************/
  async calculateSubTotal(): Promise<any> {



    if (Number(this.quantity.value) > Number(this.quantityonHand.value)) {
      this.quantgreaterthanqoh = true;
      this.subtotal.setValue(0);
    } else {
      this.quantgreaterthanqoh = false;
      this.subtotal.setValue(this.quantity.value * this.unitprice.value);
    }

  }

  /****************************** end calculate subtotal**************************/


  /****************************** start calculate total**************************/
  async calculateTotal(subtot: number): Promise<boolean> {
    this.totalamount.value = 0;
    return new Promise(resolve => {
      for (const itemnameElement of this.allSelectedItems) {
        this.totalamount.value += itemnameElement.sub_total;
        this.grandtotal.value += itemnameElement.sub_total;
      }
      resolve(true);
    });
  }

  /****************************** end calculate total**************************/


  /****************************** start load all items id**************************/
  async loadItemDetails(): Promise<boolean> {
    this.spinner.show();
    return new Promise(resolve => {
      const val = this.allItems.find((value, index) => {
        if (value.name === this.itemname.value) {


          this.quantityonHand.setValue(value.qty);
          this.unitprice.setValue(value.unit_price);
          this.orderForm.patchValue({
            itemId: value.id
          });
        }
      });
      this.spinner.hide();
      resolve(true);
    });
  }

  /****************************** end load all items id**************************/


  /****************************** start discount order**************************/
  discountItem(): any {
    this.grandtotal.setValue(this.totalamount.value - this.discount.value);

  }

  /****************************** end discount order**************************/


  /****************************** start place order**************************/
  async saveOrderToDB(): Promise<boolean> {
    this.spinner.show();
    return new Promise(resolve => {
      const data: ItemForOrder[] = [];
      for (let i = 0; i < this.allSelectedItems.length; i++) {
        const item = new ItemForOrder(this.allSelectedItems[i]?.id, this.allSelectedItems[i].qty, this.allSelectedItems[i].sub_total, this.allSelectedItems[i].unit_price);
        data.push(item);
        if (i === this.allSelectedItems.length - 1) {

          const order = new Order(this.grandtotal.value, this.discount.value, new CustomerForOrder(this.name.value), data);

          this.orderService.saveOrder(order).subscribe((res: any) => {
            if (res.message === 'Successfully saved!') {
              this.alertService.success(res.message);
              this.clearOrder();
              this.spinner.hide();
              resolve(true);
            } else {
              this.alertService.warning(res.message);
              this.spinner.hide();
              resolve(false);
            }

          }, (errors: any) => {
            this.alertService.warning(this.alertJson.backendError);
            this.spinner.hide();
          });
        }
      }

    });
  }

  /****************************** end  place order**************************/


  /****************************** start  clear order form*************************/
  clearOrder(): any {
    this.orderForm.reset();
    this.allSelectedItems = [];
    this.placeOrderForm.reset();
    this.itemname.setValue('select');
    this.name.setValue('select');
    this.quantity.setValue(0);
    this.unitprice.setValue(0);
    this.subtotal.setValue(0);
    this.quantityonHand.setValue(0);
    this.grandtotal.setValue(this.totalamount.value);
  }

  /****************************** end clear order form************************/


  /****************************** start sub total************************/
  private async savetotable(savebtn: HTMLButtonElement): Promise<boolean> {
    this.spinner.show();
    return new Promise(async resolve => {
      const index = this.allSelectedItems.findIndex((item, i) => {
        return item.name === this.itemname.value;
      });


      // tslint:disable-next-line:max-line-length
      const x = new SelectedItem(this.itemname.value, this.quantity.value, this.subtotal.value, this.unitprice.value, this.orderForm.value.itemId);
      if (index !== -1) {
        this.allSelectedItems[index] = x;
      } else {
        this.allSelectedItems.push(x);
      }
      await this.calculateTotal(this.subtotal.value);
      this.orderForm.reset();
      this.itemname.setValue('select');
      this.quantity.setValue(0);
      this.unitprice.setValue(0);
      this.subtotal.setValue(0);
      this.quantityonHand.setValue(0);
      this.grandtotal.setValue(this.totalamount.value);
      savebtn.innerText = 'Add to cart';
      this.spinner.hide();
      resolve(true);
    });
  }

  /****************************** end sub total**************************/

  /******************************** start save customer**********************************/
  async saveCustomer(savebtn: HTMLButtonElement): Promise<boolean> {
    return new Promise(resolve => {

      const customer = new Customer(this.cus_name.value, this.cus_mobile.value, this.cus_address.value);
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

}
