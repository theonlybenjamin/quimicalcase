import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalInterface } from '../interfaces/modal.interface';
import { Sale } from '../interfaces/sale';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private sale: Sale = {} as Sale;
  protected openModalComponent = new Subject<ModalInterface>();
  protected closeModalComponent = new Subject<boolean>();

  public getEditSale(): Sale {
    return this.sale;
  }

  public setEditSale(sale: Sale) {
    this.sale = sale;
  }

  /**
   *  MODAL
   */
  public openModal(content: ModalInterface) {
    this.openModalComponent.next(content);
  }

  public closeModalNext() {
    this.closeModalComponent.next(true);
  }

  public openModalSubscribe(callback: (item: ModalInterface) => void) {
    this.openModalComponent.subscribe(callback);
  }

  public closeModalSubscribe(callback: (item: boolean) => void) {
    this.closeModalComponent.subscribe(callback);
  }
}
