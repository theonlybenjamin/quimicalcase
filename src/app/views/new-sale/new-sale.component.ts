import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, from } from 'rxjs';
import { catchError, concatMap, finalize, toArray } from 'rxjs/operators';
import { Routes } from 'src/app/config/routes.enum';
import { Sale } from 'src/app/interfaces/sale';
import { IFirebaseDocument, IProduct, Stock } from 'src/app/interfaces/stock';
import { EnviosDocService } from 'src/app/services/envios-doc.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SalesService } from 'src/app/services/sales.service';
import { StockService } from 'src/app/services/stock.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalInterface } from 'src/app/interfaces/modal.interface';

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss']
})
export class NewSaleComponent {

  public codesToList: IFirebaseDocument[] = [];
  public modelsgroupedForCode: Array<Array<IProduct>> = [];
  public saleForm: FormGroup;
  public productsSelled: IProduct[] = [];
  public newSale: Sale = {} as Sale;
  public notRegisteredSalesToSelect: Array<string> = [];

  constructor(
    public firebaseService: StockService,
    private salesService: SalesService,
    private loaderService: LoaderService,
    public router: Router,
    private modalService: NgbModal,
    private envios: EnviosDocService,
    private messageService: MessageService
  ) {
    this.firebaseService.getStockAllDocumentsName().subscribe(x => {
      this.codesToList = x;
    });
    this.envios.getPendingOfSend().subscribe(x => {
      x.data.forEach(x => {
        if (x.products === null || x.products?.length === 0) {
          this.notRegisteredSalesToSelect.push(x.username);
        }
      })
    });

    this.saleForm = new FormGroup({
      client: new FormControl(null),
      sale_channel: new FormControl('Instagram', Validators.required),
      summary: new FormControl(null, Validators.required),
      payment_type: new FormControl('yape', Validators.required),
      products: new FormArray([
        new FormGroup({
          code: new FormControl(null, Validators.required),
          name: new FormControl({value: '', disabled: true}, Validators.required),
          selectedQuantity: new FormControl({value: 0, disabled: true}, Validators.required)
        })
      ]),
      date: new FormControl(null)
    });
  }

  get products() {
    return this.saleForm.get('products') as FormArray;
  }

  get array() {
    return this.products.controls;
  }

  get isDeliverySellType() {
    return this.saleForm.controls['sale_channel'].value === 'Instagram' ||
      this.saleForm.controls['sale_channel'].value === 'Whatsapp';
  }

  getArrayFormGroup(i: number) {
    return this.array[i] as FormGroup;
  }

  public searchIphoneCases(indexOfProductFormArrayGroup: number) {
    const productformGroupValue = this.getArrayFormGroup(indexOfProductFormArrayGroup).value;
    this.firebaseService.getProductStock(productformGroupValue.code).subscribe(x => {
      this.modelsgroupedForCode[indexOfProductFormArrayGroup] = x.data;
    });
  }

  productQuantity(index: number) {
    if (this.modelsgroupedForCode.length > 0) {
      const indexOfCode = this.modelsgroupedForCode
        .findIndex(product => product[0].code === this.array[index].value.code);
        if (this.modelsgroupedForCode[indexOfCode] && this.modelsgroupedForCode[indexOfCode].length > 0 && this.array[index].value.name) {
        const indexOfProduct = this.modelsgroupedForCode[indexOfCode].findIndex(z => z.name === this.array[index].value.name);
        if (indexOfProduct !== -1) {
          return this.modelsgroupedForCode[indexOfCode][indexOfProduct].cant;
        }
      }
    }
    return 0;
  }

  shouldDisabledModelInput(index: number) {
    if (this.array[index].value.code && this.array[index].value.code.length > 0) {
      this.array[index].get('name')?.enable();
    } else {
      this.array[index].get('name')?.disable();
    }
  }

  shouldDisabledModelSelectedQuantity(index: number) {
    if (this.array[index].value.name && this.array[index].value.name.length > 0) {
      this.array[index].get('selectedQuantity')?.enable();
    } else {
      this.array[index].get('selectedQuantity')?.disable();
    }
  }

  addFormGroup() {
    this.products.push(new FormGroup({
      code: new FormControl(null, Validators.required),
      name: new FormControl({value: '', disabled: true}, Validators.required),
      selectedQuantity: new FormControl({value: 0, disabled: true}, Validators.required)
    }))
  }

  deleteFormGroup() {
    this.array.pop();
  }

  public openErrorModal() {
    const modal: ModalInterface = {
      title: 'Ocurrio un Error actualizando el stock',
      body: 'Enviar captura al administrador'
    }
    this.messageService.openModal(modal);
  }

  public goPending() {
    this.modalService?.dismissAll();
    this.router.navigate([Routes.SEND_PENDING])
  }

  public doSale(): void {
    this.loaderService.showLoader();
    from(this.array).pipe(
      concatMap(formArray => {
        const indexOfProductCode = this.modelsgroupedForCode.findIndex(code => code === formArray.value.code);
        const indexOfProduct = this.modelsgroupedForCode[indexOfProductCode].findIndex(z => z.name === formArray.value.name);
        var finalCasesArray: Stock = {} as Stock;
        this.modelsgroupedForCode[indexOfProductCode][indexOfProduct].cant -= formArray.value.selectedQuantity;

        const sell_price = this.modelsgroupedForCode[indexOfProductCode][indexOfProduct].sell_price;
        const buy_price = this.modelsgroupedForCode[indexOfProductCode][indexOfProduct].buy_price;
        const cant = this.modelsgroupedForCode[indexOfProductCode][indexOfProduct].cant;
        const description = this.modelsgroupedForCode[indexOfProductCode][indexOfProduct].description;


        if (this.modelsgroupedForCode[indexOfProductCode][indexOfProduct].cant === 0) {
          this.modelsgroupedForCode[indexOfProductCode].splice(indexOfProduct, 1);
        }
        finalCasesArray.data = this.modelsgroupedForCode[indexOfProductCode];

        var productSelled: IProduct = {
          selectedQuantity: formArray.value.selectedQuantity,
          name: formArray.value.name,
          code: formArray.value.code,
          cant: cant,
          description: description,
          sell_price: sell_price,
          buy_price: buy_price,
        }
        this.productsSelled.push(productSelled);
        const fecha = new Date();

        this.newSale = {
          cliente: this.saleForm.get('client')?.value,
          tipo_entrega: this.saleForm.get('sell_type')?.value,
          total: this.saleForm.get('summary')?.value,
          products: this.productsSelled,
          canal_venta: this.saleForm.get('sale_channel')?.value,
          payment_type: this.saleForm.get('payment_type')?.value,
          date: fecha.getDate() + '/' + fecha.getMonth()
        };
        return this.firebaseService.updateSotckAfterSale(formArray.value.code, finalCasesArray).pipe(
          catchError(error => {
            this.prepareSendPendingData(this.newSale);
            this.openErrorModal();
            this.loaderService.hideLoader();
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
          this.sendAllSalesData(this.newSale),
          this.prepareSendPendingData(this.newSale),
        ]).pipe(
          catchError(error => {
            this.openErrorModal();
            this.loaderService.hideLoader();
            return error;
          }),
          finalize(() => {
            const modal: ModalInterface = {
              title: 'Stock Actualizado',
              body: '<p>Operacion ejecutada correctamente.</p>',
              button1Text: 'Entendido',
              button1Action: this.goPending.bind(this)
            }
            this.messageService.openModal(modal);
            this.loaderService.hideLoader();
          })
        ).subscribe()
      }))
      .subscribe()
  }

  public prepareSendPendingData(newSale: Sale) {
    return this.envios.addProductToPendingOrder(newSale);
  }

  public sendAllSalesData(newSale: Sale) {
    return this.salesService.addSaleToAllSales(newSale);
  }

}
