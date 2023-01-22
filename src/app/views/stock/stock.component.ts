import { Component } from '@angular/core';
import { isEqual } from 'lodash';
import { StockCollections } from 'src/app/enums/stock-collections.enum';
import { IProduct, Stock } from 'src/app/interfaces/stock';
import { StockService } from 'src/app/services/stock.service';
import { idByIphoneName } from '../../utils/utils'
@Component({
  selector: 'app-stock',
  styleUrls: ['./stock.component.scss'],
  templateUrl: './stock.component.html'
})
export class StockComponent {

  public productsOfSelectedCode: Array<IProduct> = [];
  public IPhoneProducts = [
    'IPhone 11',
    'IPhone 11 Pro',
    'IPhone 11 Pro Max',
    'IPhone 12/12pro',
    'IPhone 12 Mini',
    'IPhone 12 Pro Max',
    'IPhone X/XS',
    'IPhone XS Max',
    'IPhone XR',
    'IPhone 13',
    'IPhone 13 Pro',
    'IPhone 13 Pro Max',
    'IPhone 13 Mini',
    'IPhone 14',
    'IPhone 14 Pro',
    'IPhone 14 Max',
    'IPhone 14 Pro Max',
    'IPhone 7/8/SE2020',
    'IPhone 7/8 plus',
    'Airpods Pro',
    'Airpods 3er gen',
    'Airpods 1era gen / 2da gen',
    'Cable',
    'Mica',
    'Camara',
    'Regalos'
  ];
  public selectedCode: string = '';
  public productsOfSelectedCodeContainer!: Stock;
  constructor(
    public stockService: StockService
  ) {
    const value = { value: StockCollections.IPhone11 };
    this.searchByCode(value);
    // this.fireService.newBD(StockCollections.IPhone11).subscribe();
  }

  public searchByCode(code: any) {
    this.selectedCode = idByIphoneName(code.value);
    this.stockService.getProductStock(this.selectedCode).subscribe(productsOfSelectedCodeContainer => {
      this.productsOfSelectedCode = productsOfSelectedCodeContainer.data;
      this.productsOfSelectedCodeContainer = productsOfSelectedCodeContainer;
    });
  }

  public removeProduct(product: IProduct): void {
    if (this.productsOfSelectedCodeContainer.data.length > 0) {
      const index = this.productsOfSelectedCodeContainer.data.findIndex(productOfArray => isEqual(productOfArray, product));
      this.productsOfSelectedCodeContainer.data.splice(index, 1);
      this.stockService.updateSotckAfterSale(this.selectedCode, this.productsOfSelectedCodeContainer).subscribe();
    }
  }
}
