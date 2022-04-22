import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable, Subscription } from 'rxjs';
import { catchError, concatMap, finalize, take, toArray } from 'rxjs/operators';
import { IPhone, Stock, Product, ProductForm } from 'src/app/interfaces/stock';
import { FirebaseService } from 'src/app/services/firebase.service';
import { iphoneNameById } from 'src/app/utils/utils';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {

  public codes: IPhone[] = [];
  public cases: Array<Array<Product>> = [];
  public productForm: FormGroup;
  public cantToSell = [0];
  public showSelects = false;
  public ERROR: any;
  public modalDetail: Array<Product> = [];
  public modalErrorDetail: Array<Product> = [];
  public dataBackUp: any;
  public uploadPercent: any = 0;
  public isSameModelChecked: boolean = false;
  public isSameModelSubs: boolean = false;
  public modelSubscription: Subscription = new Subscription();
  public isSameCodeChecked: boolean = false;
  public isSameCodeSubs: boolean = false;
  public codeSubscription: Subscription = new Subscription();
  public isSameCantChecked: boolean = false;
  public isSameCantSubs: boolean = false;
  public cantSubscription: Subscription = new Subscription();
  public isSamePriceChecked: boolean = false;
  public isSamePriceSubs: boolean = false;
  public priceSubscription: Subscription = new Subscription();
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
      ]),
      sameCode: new FormControl(null),
      sameModel: new FormControl(null),
      sameCant: new FormControl(null),
      samePrice: new FormControl(null)
    });
  }

  public sameCode(state: boolean) {
    this.isSameCodeChecked = state;
      if (this.isSameCodeChecked && !this.isSameCodeSubs){
        this.codeSubscription.add(
          this.array[0].get('code')?.valueChanges.subscribe(z => {
            this.isSameCodeSubs = true
            if ((z !== null || undefined) && this.isSameCodeChecked) {
              for (let i = 1; i <this.array.length; i++) {
                this.array[i].get('code')?.setValue(z);
                this.array[i].get('code')?.disable();
              }
            }
          })
        );
      } else {
        this.codeSubscription.unsubscribe();
        this.codeSubscription = new Subscription();
        this.isSameCodeSubs = false;
        for (let i = 1; i <this.array.length; i++) {
          this.array[i].get('code')?.enable();
        }
      }
  }

  public sameCant(state: boolean) {
    this.isSameCantChecked = state;
      if (this.isSameCantChecked && !this.isSameCantSubs){
        this.cantSubscription.add(
          this.array[0].get('cant')?.valueChanges.subscribe(z => {
            this.isSameCantSubs = true
            if ((z !== null || undefined) && this.isSameCantChecked) {
              for (let i = 1; i <this.array.length; i++) {
                this.array[i].get('cant')?.setValue(z);
                this.array[i].get('cant')?.disable();
              }
            }
          })
        );
      } else {
        this.cantSubscription.unsubscribe();
        this.cantSubscription = new Subscription();
        this.isSameCantSubs = false;
        for (let i = 1; i <this.array.length; i++) {
          this.array[i].get('cant')?.enable();
        }
      }
  }

  public samePrice(state: boolean){
    this.isSamePriceChecked = state;
      if (this.isSamePriceChecked && !this.isSamePriceSubs){
        this.priceSubscription.add(
          this.array[0].get('precio')?.valueChanges.subscribe(z => {
            this.isSamePriceSubs = true
            if ((z !== null || undefined) && this.isSamePriceChecked) {
              for (let i = 1; i <this.array.length; i++) {
                this.array[i].get('precio')?.setValue(z);
                this.array[i].get('precio')?.disable();
              }
            }
          })
        );
      } else {
        this.priceSubscription.unsubscribe();
        this.priceSubscription = new Subscription();
        this.isSameModelSubs = false;
        for (let i = 1; i <this.array.length; i++) {
          this.array[i].get('precio')?.enable();
        }
      }
  }

  public sameModel(state: boolean){
    this.isSameModelChecked = state;
      if (this.isSameModelChecked && !this.isSameModelSubs){
        this.modelSubscription.add(
          this.array[0].get('model')?.valueChanges.subscribe(z => {
            this.isSameModelSubs = true
            if ((z !== null || undefined) && this.isSameModelChecked) {
              for (let i = 1; i <this.array.length; i++) {
                this.array[i].get('model')?.setValue(z);
                this.array[i].get('model')?.disable();
              }
            }
          })
        );
      } else {
        this.modelSubscription.unsubscribe();
        this.modelSubscription = new Subscription();
        this.isSameModelSubs = false;
        for (let i = 1; i <this.array.length; i++) {
          this.array[i].get('model')?.enable();
        }
      }
  }

  get products() {
    return this.productForm.get('products') as FormArray;
  }

  get array() {
    return this.products.controls;
  }

  get arrayValues() {
    return this.products.getRawValue() as Array<ProductForm>;
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
    if (this.isSameCodeChecked) {
      this.array[0].get('code')?.setValue(this.array[0].get('code')?.value)
    }
    if (this.isSameCantChecked) {
      this.array[0].get('cant')?.setValue(this.array[0].get('cant')?.value)
    }
    if (this.isSameModelChecked) {
      this.array[0].get('model')?.setValue(this.array[0].get('model')?.value)
    }
    if (this.isSamePriceChecked) {
      this.array[0].get('precio')?.setValue(this.array[0].get('precio')?.value)
    }
  }

  deleteFormGroup() {
    this.array.pop();
  }

  saveFormGroup() {
    this.firebaseService.showLoader();
     from(this.arrayValues).pipe(
       concatMap((x) => {
        var dataBack: Product;
        dataBack = {
          producto: x.model.toLowerCase(),
          cant: Number(x.cant),
          precio: x.precio
        }
        return this.getProducts(x.code, dataBack);
       }),toArray(),
       finalize(() => {
        this.firebaseService.hideLoader();
        this.modalService?.open(this.successModal, {centered: true});
        this.reloadCurrentRoute()
       }),
       catchError(z => {
        this.modalService?.open(this.errorModal, {centered: true, });
        return z;
       })
     ).subscribe()
  }

  public getProducts(document: string, dataBack: Product): Observable<Stock> {
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

  public sendNewProduct(document:string, dataBack: Product, array: Stock): Observable<any> {
    return this.firebaseService.addNewProduct(document, array).pipe(
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

  public reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }
}
