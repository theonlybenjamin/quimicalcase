import { Injectable } from '@angular/core';
import { Sale } from '../interfaces/sale';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private sale: Sale = {} as Sale;
  constructor(

  ) { }

  public getEditSale(): Sale {
    return this.sale;
  }

  public setEditSale(sale: Sale) {
    this.sale = sale;
  }
}
