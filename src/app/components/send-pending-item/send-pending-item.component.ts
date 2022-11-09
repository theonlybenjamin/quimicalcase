import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPending } from 'src/app/interfaces/envios.interface';
import { Sale } from 'src/app/interfaces/sale';
import { setDashesToName } from 'src/app/utils/utils';

@Component({
  selector: 'app-send-pending-item',
  templateUrl: './send-pending-item.component.html'
})
export class SendPendingItemComponent implements OnInit {

  @Input() summaryText: string = '';
  @Input() orders: Array<Sale> = [];
  @Input() pendingOrders: Array<IPending> = [];
  @Input() showButton: boolean = true;
  @Input() textButton: string = '';
  @Input() showButton2: boolean = false;
  @Input() textButton2: string = '';
  @Input() showTotal: boolean = false;
  @Output() actionButton1 = new EventEmitter<any>();
  @Output() actionButton2 = new EventEmitter<any>();
  public totalSummary: number = 0;
  constructor(
    ) { }

  ngOnInit(): void {
    this.orders.forEach(x => this.totalSummary += (x.total? x.total : 0));
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

  public getImageURL(name: string, code: string) {
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
