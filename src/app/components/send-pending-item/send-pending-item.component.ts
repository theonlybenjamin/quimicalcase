import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sale } from 'src/app/interfaces/sale';
import { iphoneNameById, setDashesToName } from 'src/app/utils/utils';

@Component({
  selector: 'app-send-pending-item',
  templateUrl: './send-pending-item.component.html'
})
export class SendPendingItemComponent {
  @Input() order!: Sale;
  @Output() actionButton1 = new EventEmitter<any>();
  @Output() actionButton2 = new EventEmitter<any>();
  constructor(
    ) { }

  public iphoneNameByIdTS(id: string){
    return iphoneNameById(id);
  }

  noHaveProducts(pendingOrder: any) {
    if (pendingOrder && pendingOrder.products && pendingOrder.products.length > 0) {
      return true;
    }
    return false;
  }
  public emitButton1(order: any) {
    this.actionButton1.emit(order);
  }

  public emitButton2(order: any) {
    this.actionButton2.emit(order);
  }

  public getImageURL(name: string, code: string): string {
    return setDashesToName(name, code);
  }

  public getSellChannelImageUrl(sellChannel: string) {
    switch (sellChannel) {
      case 'Whatsapp': return 'assets/icons/whatsapp.png';
      case 'Instagram': return 'assets/icons/instagram.png';
      case 'Web': return 'assets/logo2.png';
      default: return 'assets/logo2.png';
    }
  }
}
