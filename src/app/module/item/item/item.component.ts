import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Item} from '../Item';
import {NgxSpinnerService} from 'ngx-spinner';
import {AlertService} from 'ngx-alerts';
import {Alert} from '../../../../assets/alert';
// @ts-ignore
import alertJson from '../../../../assets/alert.json';
import { ItemService } from 'src/app/core/service/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  itemForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    qty: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
    unitPrice: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
  });
  allItems: Item[] = [];
  alertJson: Alert = alertJson;
  // tslint:disable-next-line:variable-name
  item_details: any;

  constructor(private spinner: NgxSpinnerService, private itemService: ItemService, private alertService: AlertService) {
  }

  get name(): any {
    return this.itemForm.get('name');
  }

  get qty(): any {
    return this.itemForm.get('qty');
  }

  get unitPrice(): any {
    return this.itemForm.get('unitPrice');
  }

  async ngOnInit(): Promise<any> {
    await this.spinner.show();
    await this.loadAllItems();
    await this.spinner.hide();
  }

  /**************************** start cancel add item ********************************/
  async cancel(savebtn: HTMLButtonElement): Promise<any> {
    this.itemForm.reset();
    savebtn.innerText = 'Save';
  }

  /**************************** end cancel add item ********************************/


  /**************************** start save or update item ********************************/
  async save(savebtn: HTMLButtonElement): Promise<any> {
    this.itemForm.markAllAsTouched();

    if (this.itemForm.valid) {
      if (savebtn.innerText === 'Save') {
        await this.saveItem(savebtn);
      } else {
        await this.updateItem(savebtn);
      }
    } else {
      this.alertService.warning(this.alertJson.formValidateError);
    }
  }

  /**************************** end save or update item ********************************/


  /**************************** start save item ********************************/
  async saveItem(savebtn: HTMLButtonElement): Promise<boolean> {
    return new Promise(resolve => {

      const item = new Item(this.name.value, this.qty.value, this.unitPrice.value);
      this.itemService.saveItem(item).subscribe((res: any) => {
        if (res.message === 'Successfully saved!') {

          this.alertService.success(res.message);
          this.allItems.push(res.object);
          this.cancel(savebtn);
        } else {
          this.alertService.danger(res.message);
        }
      }, error => {
        this.alertService.danger(this.alertJson.backendError);
      });
    });
  }

  /**************************** end save item ********************************/


  /**************************** start update item ********************************/
  async updateItem(savebtn: HTMLButtonElement): Promise<boolean> {
    this.spinner.show();
    return new Promise(resolve => {

      const item = new Item(this.name.value, this.qty.value, this.unitPrice.value, this.item_details?.obj?.id);
      this.itemService.updateItem(item).subscribe((res: any) => {
        if (res.message === 'Update Successful!') {

          this.alertService.success(res.message);
          this.allItems[this.item_details.index] = (res.object);
          this.cancel(savebtn);
          this.spinner.hide();
        } else {
          this.alertService.danger(res.message);
          this.spinner.hide();
        }
      }, error => {
        this.alertService.danger(this.alertJson.backendError);
        this.spinner.hide();
      });
    });
  }

  /**************************** end update item ********************************/


  /**************************** start delete item ********************************/
  async remove(data: Item, i: number): Promise<any> {

    this.spinner.show();
    this.itemService.deleteItem(data?.id).subscribe((res: any) => {
      if (res.message === 'Removed Successful!') {

        this.allItems.splice(i, 1);
        this.alertService.success(res.message);
        this.spinner.hide();
      } else {
        this.alertService.warning(res.message);
        this.spinner.hide();
      }
    }, error => {

      this.alertService.danger(this.alertJson.backendError);
      this.spinner.hide();
    });
  }

  /**************************** end delete item ********************************/


  /**************************** start load items to feilds ********************************/
  async edit(data: Item, i: number, savebtn: HTMLButtonElement, element: HTMLElement): Promise<boolean> {
    this.spinner.show();
    return new Promise(resolve => {
      savebtn.innerText = 'Update';
      this.item_details = {obj: data, index: i};

      this.name.setValue(data.name);
      this.qty.setValue(data.qty);
      this.unitPrice.setValue(data.unit_price);
      element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
      this.spinner.hide();
    });
  }

  /**************************** end load items to feilds ********************************/


  /**************************** start load all items to table ********************************/
  async loadAllItems(): Promise<boolean> {
    return new Promise(async resolve => {
      await this.spinner.show();
      this.itemService.getAllItems().subscribe((res: any) => {

        this.allItems = res.object;
        resolve(true);
      }, error => {
        resolve(false);
      });
    });
  }

  /**************************** end load all items to table ********************************/


}
