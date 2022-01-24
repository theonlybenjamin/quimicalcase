import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SendPending } from 'src/app/interfaces/send-pending';
import { IPhone, IProductSelled, Stock, StockProduct } from 'src/app/interfaces/stock';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  public codes: IPhone[] = [];
  public cases: Array<Array<StockProduct>> = [];
  public productForm: FormGroup;
  public cantToSell = [0];
  public showSelects = false;
  constructor(
    public firebaseService: FirebaseService,
    public router: Router
    ) {
    this.firebaseService.getStockAllDocumentsName().subscribe(x => this.codes = x);
    this.productForm = new FormGroup({
      code: new FormControl({ value: 'Selecciona el codigo' }, Validators.required),
      precio: new FormControl('', Validators.required),
      cantidad: new FormControl('Selecciona la cantidad', Validators.required),
      modelo: new FormControl('Selecciona la cantidad', Validators.required)
    })
  }

  ngOnInit(): void {
  }

  public searchModelByCode(index: number){
    this.firebaseService.getStockSpecificDocument(this.productForm.get('code'+ index)?.value).subscribe(x => {
      this.cases[index] = x.data
      this.productForm.get('case'+ index)?.enable();
    });
  }

  public updateProduct(): void {
    // const codes = Object.keys(this.productForm.value).filter(x => x.includes('code'));
    // const cases = Object.keys(this.productForm.value).filter(x => x.includes('case'));
    // const codesAndCases = this.addProductToCart(codes, cases);
    // const finalResult: Stock = {} as Stock;
    // for (let i = 0; i < codesAndCases.length; i++) {
    //   const searchObject = this.cases[codesAndCases[i].index].find(x => x.producto === codesAndCases[i].model) as StockProduct;
    //   const indexToUpdate = this.cases[codesAndCases[i].index].indexOf(searchObject);
    //     this.cases[codesAndCases[i].index].splice(indexToUpdate, 1);
    //     this.cases[codesAndCases[i].index][indexToUpdate] = {...searchObject, cant: searchObject.cant -1};
    //     finalResult.data = this.cases[codesAndCases[i].index];
    //     this.firebaseService.setFieldsStockCollection(codesAndCases[i].code, finalResult);
    // }
    this.router.navigate(['/home/pendiente-envio'])
  }

}
