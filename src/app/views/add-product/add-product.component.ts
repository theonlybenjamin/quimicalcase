import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable, Subscription } from 'rxjs';
import { catchError, concatMap, finalize, take, toArray } from 'rxjs/operators';
import { IFirebaseDocument, Stock, IProduct } from 'src/app/interfaces/stock';
import { LoaderService } from 'src/app/services/loader.service';
import { StockService } from 'src/app/services/stock.service';
import { iphoneNameById } from 'src/app/utils/utils';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {

  public codes: IFirebaseDocument[] = [];
  public cases: Array<Array<IProduct>> = [];
  public IProduct: FormGroup;
  public cantToSell = [0];
  public showSelects = false;
  public ERROR: any;
  public modalDetail: Array<IProduct> = [];
  public modalErrorDetail: Array<IProduct> = [];
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
  public isSameBuyPriceChecked: boolean = false;
  public isSameBuyPriceSubs: boolean = false;
  public priceSubscription: Subscription = new Subscription();
  @ViewChild('errroModal') errorModal: ElementRef | undefined;
  @ViewChild('successModal') successModal: ElementRef | undefined;

  constructor(
    public firebaseService: StockService,
    public router: Router,
    private modalService: NgbModal,
    private loaderService: LoaderService
    ) {
    this.firebaseService.getStockAllDocumentsName().subscribe(x => this.codes = x);
    this.IProduct = new FormGroup({
      products: new FormArray([
        new FormGroup({
          code: new FormControl(null, Validators.required),
          name: new FormControl(null, Validators.required),
          cant: new FormControl(null, Validators.required),
          sell_price: new FormControl(null, Validators.required),
          buy_price: new FormControl(null, Validators.required)
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

  public sameBuyPrice(state: boolean){
    this.isSameBuyPriceChecked = state;
      if (this.isSameBuyPriceChecked && !this.isSamePriceSubs){
        this.priceSubscription.add(
          this.array[0].get('buy_price')?.valueChanges.subscribe(z => {
            this.isSamePriceSubs = true
            if ((z !== null || undefined) && this.isSameBuyPriceChecked) {
              for (let i = 1; i <this.array.length; i++) {
                this.array[i].get('buy_price')?.setValue(z);
                this.array[i].get('buy_price')?.disable();
              }
            }
          })
        );
      } else {
        this.priceSubscription.unsubscribe();
        this.priceSubscription = new Subscription();
        this.isSameModelSubs = false;
        for (let i = 1; i <this.array.length; i++) {
          this.array[i].get('buy_price')?.enable();
        }
      }
  }

  public sameSellPrice(state: boolean){
    this.isSamePriceChecked = state;
      if (this.isSamePriceChecked && !this.isSamePriceSubs){
        this.priceSubscription.add(
          this.array[0].get('sell_price')?.valueChanges.subscribe(z => {
            this.isSamePriceSubs = true
            if ((z !== null || undefined) && this.isSamePriceChecked) {
              for (let i = 1; i <this.array.length; i++) {
                this.array[i].get('sell_price')?.setValue(z);
                this.array[i].get('sell_price')?.disable();
              }
            }
          })
        );
      } else {
        this.priceSubscription.unsubscribe();
        this.priceSubscription = new Subscription();
        this.isSameModelSubs = false;
        for (let i = 1; i <this.array.length; i++) {
          this.array[i].get('sell_price')?.enable();
        }
      }
  }

  public sameModel(state: boolean){
    this.isSameModelChecked = state;
      if (this.isSameModelChecked && !this.isSameModelSubs){
        this.modelSubscription.add(
          this.array[0].get('name')?.valueChanges.subscribe(z => {
            this.isSameModelSubs = true
            if ((z !== null || undefined) && this.isSameModelChecked) {
              for (let i = 1; i <this.array.length; i++) {
                this.array[i].get('name')?.setValue(z.toLowerCase());
                this.array[i].get('name')?.disable();
              }
            }
          })
        );
      } else {
        this.modelSubscription.unsubscribe();
        this.modelSubscription = new Subscription();
        this.isSameModelSubs = false;
        for (let i = 1; i <this.array.length; i++) {
          this.array[i].get('name')?.enable();
        }
      }
  }

  get products() {
    return this.IProduct.get('products') as FormArray;
  }

  get array() {
    return this.products.controls;
  }

  get arrayValues() {
    return this.products.getRawValue() as Array<IProduct>;
  }

  getArrayFormGroup(i:number) {
    return this.array[i] as FormGroup;
  }

  addFormGroup() {
    this.products.push(new FormGroup({
      code: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      cant: new FormControl(null, Validators.required),
      buy_price: new FormControl(null, Validators.required),
      sell_price: new FormControl(null, Validators.required)
    }))
    if (this.isSameCodeChecked) {
      this.array[0].get('code')?.setValue(this.array[0].get('code')?.value)
    }
    if (this.isSameCantChecked) {
      this.array[0].get('cant')?.setValue(this.array[0].get('cant')?.value)
    }
    if (this.isSameModelChecked) {
      this.array[0].get('name')?.setValue(this.array[0].get('name')?.value.toLowerCase())
    }
    if (this.isSamePriceChecked) {
      this.array[0].get('sell_price')?.setValue(this.array[0].get('sell_price')?.value)
    }
    if (this.isSameBuyPriceChecked) {
      this.array[0].get('buy_price')?.setValue(this.array[0].get('buy_price')?.value)
    }
  }

  deleteFormGroup() {
    this.array.pop();
  }

  saveFormGroup() {
    this.loaderService.showLoader();
     from(this.arrayValues).pipe(
       concatMap((x) => this.getProducts(x)),
       toArray(),
       finalize(() => {
        this.loaderService.hideLoader();
        this.modalService?.open(this.successModal, {centered: true});
        this.reloadCurrentRoute()
       }),
       catchError(z => {
        this.modalService?.open(this.errorModal, {centered: true, });
        return z;
       })
     ).subscribe()
  }

  public getProducts(product: IProduct): Observable<Stock> {
    var array: Stock = {
      data: []
    };
    return this.firebaseService.getStockSpecificDocumentAlone(product.code).pipe(
      take(1),
      concatMap(x => {
        if (x) {
          array = x;
          const index = array.data.findIndex(x => x.name === product.name);
          if (index !== -1) {
            array.data[index].cant += product.cant;
              if (array.data[index].sell_price !== product.sell_price) {
                array.data[index].sell_price = Number(((array.data[index].sell_price + product.sell_price) /2).toFixed(1));
              }
          } else {
            array.data.push(product);
          }
          return this.sendNewProduct(product, array);
        }
        return x;
      })
    );
  }

  public sendNewProduct(product: IProduct, array: Stock): Observable<any> {
    return this.firebaseService.addNewProduct(product.code, array).pipe(
      finalize(() => {
        product.code = iphoneNameById(product.code);
        this.modalDetail.push(product);
      }),
      catchError((error) => {
        this.ERROR = error;
        this.modalErrorDetail.push(product);
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
