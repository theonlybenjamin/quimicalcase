import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPending } from 'src/app/interfaces/envios.interface';
import { iphoneNameById, setDashesToName } from 'src/app/utils/utils';

@Component({
  selector: 'app-pending-send-card',
  templateUrl: './pending-send-card.component.html'
})
export class PendingSendCardComponent {
  @Output() sendOperation = new EventEmitter<IPending>();
  @Input() pendingOrder!: IPending;

  isPendingHasProducts(pendingOrder: IPending): boolean {
    return pendingOrder && pendingOrder.products && pendingOrder.products.length > 0
  }

  public getImageURL(name: string, code: string): string {
    return setDashesToName(name, code);
  }

  public iphoneNameByIdTS(id: string){
    return iphoneNameById(id);
  }

  public deleteOperation(order: IPending) {
    this.sendOperation.emit(order);
  }
}
