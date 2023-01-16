import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { StockCollections } from 'src/app/enums/stock-collections.enum';
import { ProductSelled } from 'src/app/interfaces/sale';
import { Stock } from 'src/app/interfaces/stock';
import { LoaderService } from 'src/app/services/loader.service';
import { StockService } from 'src/app/services/stock.service';
import { idByIphoneName, iphoneNameById, setDashesToName } from '../../utils/utils'
@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html'
})
export class StockComponent {

  public products: Array<ProductSelled> = [];
  public productBackup: Array<ProductSelled> = [];
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
  public codeValue: string = '';
  constructor(
    public fireService: StockService,
    private loaderService: LoaderService
  ) {
    var result: Array<ProductSelled> = [];
    this.loaderService.showLoader();
    this.fireService.getAllProductNames().pipe(
      map((x: Stock[]) => {
        for (let i = 0; i < x.length; i++) {
          for (let j = 0; j < x[i].data?.length; j++) {
            var iphoneCode = x[i].docId;
            if (iphoneCode) {
              var stockWithCode: ProductSelled = {
                cant: x[i].data[j].cant,
                name: x[i].data[j].name,
                sell_price: x[i].data[j].sell_price,
                code: iphoneCode,
                buy_price: x[i].data[j].buy_price
              }
              result.push(stockWithCode);
            }
          }
        }
        return result;
      })
    ).subscribe(x => {
      this.products = x;
      this.productBackup = x;
      result = [];
      this.loaderService.hideLoader();
      this.searchByCode({ value: 'IPhone 11'})
    });
    // this.fireService.newBD(StockCollections.IPhone14ProMax).subscribe();
  }

  public iphoneNameById (id: string) {
      return iphoneNameById(id);
  }
  getCaseModel(){
    var result: string[] = [];
    for (let i = 0; i < this.productBackup.length; i++){
      if (this.codeValue) {
        if (this.codeValue === this.productBackup[i].code) {
          result.push(this.productBackup[i].name);
        }
      } else {
        result.push(this.productBackup[i].name);
      }
    }
    return result;
  }

  public searchByCode(code: any) {
    var id = idByIphoneName(code.value);
    this.codeValue = id;
    this.getCaseModel();
    var filter = this.productBackup.filter(x => x.code === id);
    if (code.value === 'reset') {
      this.products = this.productBackup;
      this.codeValue = '';
      this.getCaseModel();
    } else {
      this.products = filter;
      console.log(this.products);
    }
  }

  public searchByModel(model: any) {
    var filter = this.productBackup.filter(x => x.name === model.value);
    if (model.value === 'reset') {
      this.products = this.productBackup;
    } else {
      this.products = filter;
    }
  }

  public getImageURL(name: string, code: string) {
    return setDashesToName(name, code);
  }
}
