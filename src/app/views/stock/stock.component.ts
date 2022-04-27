import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ProductSelled } from 'src/app/interfaces/sale';
import { Stock } from 'src/app/interfaces/stock';
import { FirebaseService } from 'src/app/services/firebase.service';
import { idByIphoneName, iphoneNameById, setDashesToName } from '../../utils/utils'
@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  
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
    public fireService: FirebaseService
  ) {
    var result: Array<ProductSelled> = [];
    this.fireService.showLoader();
    this.fireService.getAllProductNames().pipe(
      map((x: Stock[]) => {
        for (let i = 0; i < x.length; i++) {
          for (let j = 0; j < x[i].data?.length; j++) {
            var iphoneCode = x[i].docId;
            if (iphoneCode) {
              var stockWithCode: ProductSelled = {
                cant: x[i].data[j].cant,
                producto: x[i].data[j].producto,
                precio: x[i].data[j].precio,
                iphoneCode: iphoneCode
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
      this.fireService.hideLoader();
      this.searchByCode({ value: 'IPhone 11'})
    })
  }

  ngOnInit(): void {
  }

  public iphoneNameById (id: string) {
      return iphoneNameById(id);
  }
  getCaseModel(){
    var result: string[] = [];
    for (let i = 0; i < this.productBackup.length; i++){
      if (this.codeValue) {
        if (this.codeValue === this.productBackup[i].iphoneCode) {
          result.push(this.productBackup[i].producto);
        }
      } else {
        result.push(this.productBackup[i].producto);
      }
    }
    return result;
  }

  public searchByCode(code: any) {
    console.log(code.value);
    var id = idByIphoneName(code.value);
    this.codeValue = id;
    this.getCaseModel();
    var filter = this.productBackup.filter(x => x.iphoneCode === id);
    if (code.value === 'reset') {
      this.products = this.productBackup;
      this.codeValue = '';
      this.getCaseModel();
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

  public getImageURL(name: string, code: string) {
    return setDashesToName(name, code);
  }
}
