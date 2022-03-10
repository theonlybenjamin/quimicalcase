import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, from } from 'rxjs';
import { catchError, concatMap, finalize, toArray } from 'rxjs/operators';
import { SendPending } from 'src/app/interfaces/send-pending';
import { IPhone, IProductSelled, Stock, StockProduct } from 'src/app/interfaces/stock';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss']
})
export class NewSaleComponent {

  public codes: IPhone[] = [];
  public cases: Array<Array<StockProduct>> = [];
  public saleForm: FormGroup;
  public cantToSell = [0];
  public showSelects = false;
  public deleteFromDrive: IProductSelled[] = [];
  public updatedModels: IProductSelled[] = [];
  @ViewChild('content') modal: ElementRef | undefined;
  @ViewChild('errroModal') errorModal: ElementRef | undefined;
  public ERROR: any;
  public capital: number = 0;
  constructor(
    public firebaseService: FirebaseService,
    public router: Router,
    private modalService: NgbModal
    ) {
    this.firebaseService.showLoader();
    this.firebaseService.getStockAllDocumentsName().subscribe(x => {
      this.codes = x;
      this.firebaseService.hideLoader();
    });
    this.saleForm = new FormGroup({
      client: new FormControl(null, Validators.required),
      delivery_type: new FormControl(null, Validators.required),
      sale_channel: new FormControl(null, Validators.required),
      summary: new FormControl(null, Validators.required),
      delivery_price: new FormControl(null),
      products: new FormArray([
        new FormGroup({
          code: new FormControl(null, Validators.required),
          model: new FormControl(null, Validators.required),
          cant: new FormControl(1, Validators.required)
        })
      ])
    });
  }

  get products() {
    return this.saleForm.get('products') as FormArray;
  }

  get array() {
    return this.products.controls;
  }

  getArrayFormGroup(i:number) {
    return this.array[i] as FormGroup;
  }

  public searchIphoneCases(index: number){
    const formGroupValue = this.getArrayFormGroup(index).value;
    this.firebaseService.getStockSpecificDocument(formGroupValue.code).subscribe(x => {
      this.cases[index] = x.data
      this.cases[index].push(x.docId as unknown as StockProduct);
    });
  }

  addFormGroup() {
    this.products.push(new FormGroup({
      code: new FormControl(null, Validators.required),
      model: new FormControl(null, Validators.required),
      cant: new FormControl(1, Validators.required)
    }))
  }

  deleteFormGroup() {
    this.array.pop();
  }

  public openModal() {
    this.modalService?.open(this.modal, {centered: true});
  }

  public openErrorModal() {
    this.modalService?.open(this.errorModal, {centered: true});
  }

  public goPending() {
    this.modalService?.dismissAll();
    this.router.navigate(['/home/pendiente-envio'])
  }

  public doSale(): void {
    this.firebaseService.showLoader();
      from(this.array).pipe(
      concatMap(x => {
        /**
         * @this.@cases traera todo el array de modelos (estos tienen de todos los codigos que fueron llamados)
         * es un arrays de arrays
         * 
         * @codeIndex es la propiedad que almacena el index del codigo en cuestion
         * @modelIndex es la propiedad que almacena el modelo a editar
         * @finalResult se almacena el nuevo resultado del arrya
         */
        const codeIndex = this.cases.findIndex(y => y[y.length - 1] === x.value.code);
        const modelIndex = this.cases[codeIndex].findIndex(z => z.producto === x.value.model);
        var finalResult: Stock = {} as Stock;
        this.cases[codeIndex][modelIndex].cant = this.cases[codeIndex][modelIndex].cant - x.value.cant;
        /**
         * Si la cantidad actual del producto es 0, se agrega al modal que muestra los cases a eliminar
         * y se eliminar del array
         */
        if (this.cases[codeIndex][modelIndex].cant === 0) {
          this.deleteFromDrive.push(x.value);
          this.cases[codeIndex].splice(modelIndex, 1);
        }
        finalResult.data = this.cases[codeIndex];
        /**
         * Eliminar el ultimo objecto del array que es el codigo del modelo
         */
        if (finalResult.data[finalResult.data.length - 1] === x.value.code) {
          finalResult.data.pop();
        }
        this.updatedModels.push(x.value);
        this.capital += this.cases[codeIndex][modelIndex]?.precio;
        return this.firebaseService.setFieldsStockCollection(x.value.code, finalResult).pipe(
          catchError(error => {
            this.prepareSendPendingData();
            this.ERROR = error;
            this.openErrorModal();
            this.firebaseService.hideLoader();
            return error;
          }) 
        );
      }),
      toArray(),
      finalize(() => {
       /**
        * Una vez terminado el loop, procedemos a preparar la data a enviar y a
        * rutear al home o mostrar el modal de cases a elminar
        */
       forkJoin([
        this.sendAllSalesData(),
        this.prepareSendPendingData(),
        this.sendTotalToFinance()
       ]).pipe(
        finalize(() => {
          if (this.deleteFromDrive.length === 0) {
            this.router.navigate(['/home/pendiente-envio']);
          } else {
            this.openModal();
          }
          this.firebaseService.hideLoader();
        })
      ).subscribe()
      }))
      .subscribe()
  }

  public prepareSendPendingData() {
    var obj: SendPending = {
      cliente: this.saleForm.get('client')?.value,
      tipo_entrega: this.saleForm.get('delivery_type')?.value,
      productos: this.updatedModels,
      canal_venta: this.saleForm.get('sale_channel')?.value
    };
    return this.firebaseService.setSendPendingColecction(obj);
  }

  public sendTotalToFinance() {
    return this.firebaseService.setNewTotalSales(this.saleForm.get('summary')?.value);
  }

  public sendAllSalesData() {
    var allSales: SendPending = {
      cliente: this.saleForm.get('client')?.value,
      tipo_entrega: this.saleForm.get('delivery_type')?.value,
      total: this.saleForm.get('summary')?.value,
      costo_delivery: this.saleForm.get('delivery_price')?.value,
      productos: this.updatedModels,
      capital: this.capital,
      canal_venta: this.saleForm.get('sale_channel')?.value
    };

    return this.firebaseService.setAllSalesCollecction(allSales);
  }
  
}
