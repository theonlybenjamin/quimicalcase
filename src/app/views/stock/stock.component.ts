import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Stock, Stock2, StockProduct, StockProduct2 } from 'src/app/interfaces/stock';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  
  // @Input() model;
  public products: Array<StockProduct2> = [];
  public productBackup: Array<StockProduct2> = [];
  public IPhoneProducts = [
    'IPhone 11',
    'Iphone 11 Pro',
    'Iphone 11 Pro Max',
    'Iphone 12/12pro',
    'Iphone 12 Mini',
    'Iphone 12 Pro Max',
    'IPhone X/XS',
    'IPhone XS Max',
    'IPhone XR',
    'Iphone 13',
    'IPhone 13 Pro',
    'Iphone 13 Pro Max',
    'IPhone 13 Mini',
    'IPhone 7/8/SE2020',
    'IPhone 7/8 plus',
    'Airpods Pro / Airpods 3er gen',
    'Airpods 1era gen / 2da gen',
    'Cable'
  ]
  constructor(
    public fireService: FirebaseService
  ) {
    var result: Array<StockProduct2> = [];
    this.fireService.getStockAllDocuments().pipe(
      map((x: Stock2[]) => {
        for (let i = 0; i < x.length; i++) {
          for (let j = 0; j < x[i].data?.length; j++) {
            var iphoneCode = x[i].docId;
            x[i].data[j].iphoneCode = iphoneCode as string;
            result.push(x[i].data[j]);
          }
        }
        return result;
      })
    ).subscribe(x => {
      this.products = x;
      this.productBackup = x;
      result = [];
    })
  }

  ngOnInit(): void {
  }

  rechargeData() {
    // this.fireService.setFieldsStockCollection('asd');
  }
  getCaseModel(){
    var result: string[] = [];
    for (let i = 0; i < this.productBackup.length; i++){
      result.push(this.productBackup[i].producto);
    }
    return result;
  }

  public searchByCode(code: any) {
    var id = this.fireService.idByName(code.value);
    var filter = this.productBackup.filter(x => x.iphoneCode === id);
    if (code.value === 'reset') {
      this.products = this.productBackup;
    } else {
      this.products = filter;
    }
  }

  public searchByModel(model: any) {
    var filter = this.productBackup.filter(x => x.producto === model.value);
    if (model.value === 'reset') {
      this.products = this.productBackup;
    } else {
      this.products = filter;
    }
  }
}
