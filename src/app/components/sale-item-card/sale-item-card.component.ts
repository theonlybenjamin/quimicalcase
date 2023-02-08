import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Sale } from 'src/app/interfaces/sale';
import { iphoneNameById, setDashesToName } from 'src/app/utils/utils';

@Component({
  selector: 'app-sale-item-card',
  templateUrl: './sale-item-card.component.html'
})
export class SaleItemCard implements OnChanges {
  @Input() order!: Sale;
  @Output() sendOrderToDelete = new EventEmitter<Sale>();
  @Output() sendOrderToaddLogisticCost = new EventEmitter<Sale>();
  public productsCost: number = 0;

  ngOnChanges(): void {
    if (this.order?.products?.length > 0) {
      this.order.products.forEach(x => {
        this.productsCost += x.buy_price
      });
    }
  }
  public iphoneNameByIdTS(id: string){
    return iphoneNameById(id);
  }

  public deleteSale(order: Sale) {
    this.sendOrderToDelete.emit(order);
  }

  public addLogisticCost(order: Sale) {
    this.sendOrderToaddLogisticCost.emit(order);
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
