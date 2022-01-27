import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { concat, from, interval, of, Subscription } from 'rxjs';
import { catchError, concatMap, delay, finalize, take, tap, toArray } from 'rxjs/operators';
import { IPhone, Stock, StockProduct } from 'src/app/interfaces/stock';
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
  public ERROR: any;
  public modalDetail: any;
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
       }),toArray()
     ).subscribe(x => {
       console.log('x', x)
     })
  }

  public getProducts(document: string, dataBack: StockProduct) {
    var array: Stock = {
      data: []
    };
      return this.firebaseService.getStockSpecificDocumentAlone(document).pipe(
        take(1),
        tap(x => {
          if (x) {
            array = x;
            array.data.push(dataBack);
            this.sendNewProduct(document, dataBack, array);
          }
        })
      );
  }

  public sendNewProduct(document:string, dataBack: StockProduct, array: Stock) {
    this.firebaseService.setNewProduct(document, array).pipe(
      take(1),
      catchError((error) => {
        this.ERROR = error;
        this.modalDetail = dataBack;
        this.dataBackUp = array;
        this.modalService?.open(this.errorModal, {centered: true, });
        return error;
      })
    ).subscribe(x => {
      this.modalDetail = dataBack
      this.modalService?.open(this.successModal, {centered: true});
    })
  }
}
