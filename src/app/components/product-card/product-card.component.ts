import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProduct } from 'src/app/interfaces/stock';
import { iphoneNameById, setDashesToName } from 'src/app/utils/utils';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {

  @Input() product!: IProduct;
  @Output() removeProduct: EventEmitter<IProduct> = new EventEmitter();
  public clickedClass = false;
  
  public getImageURL(name: string, code: string) {
    return setDashesToName(name, code);
  }

  public iphoneNameById(id: string) {
    return iphoneNameById(id);
  }

  emitRemoveProduct(product: IProduct) {
    this.removeProduct.emit(product);
  }
}
