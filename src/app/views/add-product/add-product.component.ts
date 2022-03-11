import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable } from 'rxjs';
import { catchError, concatMap, finalize, take, toArray } from 'rxjs/operators';
import { IPhone, Stock, StockProduct } from 'src/app/interfaces/stock';
import { FirebaseService } from 'src/app/services/firebase.service';
import { iphoneNameById } from 'src/app/utils/utils';

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
  public ERROR: any;
  public modalDetail: Array<StockProduct> = [];
  public modalErrorDetail: Array<StockProduct> = [];
  public dataBackUp: any;
  @ViewChild('errroModal') errorModal: ElementRef | undefined;
  @ViewChild('successModal') successModal: ElementRef | undefined;
  constructor(
    public firebaseService: FirebaseService,
    public router: Router,
    private modalService: NgbModal
    ) {
    this.firebaseService.getStockAllDocumentsName().subscribe(x => this.codes = x);
    this.productForm = new FormGroup({
      products: new FormArray([
        new FormGroup({
          code: new FormControl(null, Validators.required),
          model: new FormControl(null, Validators.required),
          cant: new FormControl(null, Validators.required),
          precio: new FormControl(null, Validators.required)
        })
      ])
    });
  }

  ngOnInit(): void {
    
  }

  get products() {
    return this.productForm.get('products') as FormArray;
  }

  get array() {
    return this.products.controls;
  }

  getArrayFormGroup(i:number) {
    return this.array[i] as FormGroup;
  }

  addFormGroup() {
    this.products.push(new FormGroup({
      code: new FormControl(null, Validators.required),
      model: new FormControl(null, Validators.required),
      cant: new FormControl(null, Validators.required),
      precio: new FormControl(null, Validators.required)
    }))
  }

  deleteFormGroup() {
    this.array.pop();
  }

   saveFormGroup() {
    this.firebaseService.showLoader();
     from(this.array).pipe(
       concatMap((x) => {
        var dataBack: StockProduct;
        const value = x.value;
        dataBack = {
          producto: value.model,
          cant: Number(value.cant),
          precio: value.precio
        }
        return this.getProducts(value.code, dataBack);
       }),toArray(),
       finalize(() => {
        this.firebaseService.hideLoader();
        this.modalService?.open(this.successModal, {centered: true});
       }),
       catchError(z => {
        this.modalService?.open(this.errorModal, {centered: true, });
        return z;
       })
     ).subscribe()
  }

  public getProducts(document: string, dataBack: StockProduct): Observable<Stock> {
    var array: Stock = {
      data: []
    };
    return this.firebaseService.getStockSpecificDocumentAlone(document).pipe(
      take(1),
      concatMap(x => {
        if (x) {
          array = x;
          array.data.push(dataBack);
          return this.sendNewProduct(document, dataBack, array);
        }
        return x;
      })
    );
  }

  public sendNewProduct(document:string, dataBack: StockProduct, array: Stock): Observable<any> {
    return this.firebaseService.setNewProduct(document, array).pipe(
      finalize(() => {
        dataBack.iphoneCode = iphoneNameById(document);
        this.modalDetail.push(dataBack);
      }),
      catchError((error) => {
        this.ERROR = error;
        this.modalErrorDetail.push(dataBack);
        this.dataBackUp = array;
        return error;
      })
    )
  }
}
