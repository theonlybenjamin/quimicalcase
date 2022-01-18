import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SendPending } from 'src/app/interfaces/send-pending';
import { IPhone, IProductSelled, Stock, StockProduct } from 'src/app/interfaces/stock';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss']
})
export class NewSaleComponent implements OnInit {

  public products: IPhone[] = [];
  public cases: Array<Array<StockProduct>> = [];
  public saleForm: FormGroup;
  public cantToSell = [0];
  public showSelects = false;
  constructor(
    public firebaseService: FirebaseService,
    public router: Router
    ) {
    this.firebaseService.getStockAllDocumentsName().subscribe(x => this.products = x);
    this.saleForm = new FormGroup({
      iphone0: new FormControl({ value: 'Selecciona el codigo' }, Validators.required),
      cliente: new FormControl('', Validators.required),
      cantidad: new FormControl('Selecciona la cantidad', Validators.required),
      case0: new FormControl({value: 'Selecciona el modelo', disabled: true}, Validators.required),
      tipo_entrega: new FormControl('Tipo entrega', Validators.required)
    })
  }

  ngOnInit(): void {
  }

  public searchIphoneCases(index: number){
    this.firebaseService.getStockSpecificDocument(this.saleForm.get('iphone'+ index)?.value).subscribe(x => {
      this.cases[index] = x.data
      this.saleForm.get('case'+ index)?.enable();
    });
  }

  /**
   * Funcion para decidir cuantos select se mostrarán
   */
  public addCaseSelect() {
    const valueOnNumbers = Number(this.saleForm.get('cantidad')?.value);
    for (let i = 1; i < valueOnNumbers + 1; i++) {
      this.cantToSell = Array(valueOnNumbers).fill(i);
      this.saleForm.addControl('iphone' + i, new FormControl({ value: 'Selecciona el codigo' }, Validators.required))
      this.saleForm.addControl('case' + i, new FormControl({value: 'Selecciona el modelo', disabled: true}, Validators.required))
    }
    this.showSelects = true;
  }

  public addProductToCart(codeArray: Array<string>, casesArray: Array<string>): IProductSelled[] {
    var result: IProductSelled[] = [];
    for (let i = 0; i < codeArray.length -1; i++) {
      let obj = { code: this.saleForm.get(codeArray[i])?.value,
                  model: this.saleForm.get(casesArray[i])?.value,
                  index: i
                };
      result.push(obj);
    }
    return result;
  }

  public doSale(): void {
    const codes = Object.keys(this.saleForm.value).filter(x => x.includes('iphone'));
    const cases = Object.keys(this.saleForm.value).filter(x => x.includes('case'));
    const codesAndCases = this.addProductToCart(codes, cases);
    const finalResult: Stock = {} as Stock;
    for (let i = 0; i < codesAndCases.length; i++) {
      const searchObject = this.cases[codesAndCases[i].index].find(x => x.producto === codesAndCases[i].model) as StockProduct;
      const indexToUpdate = this.cases[codesAndCases[i].index].indexOf(searchObject);
      if (searchObject.cant === 1) {
        this.cases[codesAndCases[i].index].splice(indexToUpdate, 1);
        finalResult.data = this.cases[codesAndCases[i].index];
        this.firebaseService.setFieldsStockCollection(codesAndCases[i].code, finalResult);
      } else {
        this.cases[codesAndCases[i].index].splice(indexToUpdate, 1);
        this.cases[codesAndCases[i].index][indexToUpdate] = {...searchObject, cant: searchObject.cant -1};
        finalResult.data = this.cases[codesAndCases[i].index];
        this.firebaseService.setFieldsStockCollection(codesAndCases[i].code, finalResult);
      }
    }
    this.prepareSendPendingData(codesAndCases)
    this.router.navigate(['/home/pendiente-envio'])
  }

  public prepareSendPendingData(codesAndCases: Array<any>) {
    var obj: SendPending = {
      cliente: this.saleForm.get('cliente')?.value,
      tipo_entrega: this.saleForm.get('tipo_entrega')?.value,
      productos: codesAndCases
    };
    
    this.firebaseService.setSendPendingColecction(obj);
  }
}
