import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalInterface } from '../interfaces/modal.interface';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  protected openModalComponent = new Subject<ModalInterface>();
  protected closeModalComponent = new Subject<boolean>();
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
