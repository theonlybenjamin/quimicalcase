import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, from } from 'rxjs';
import { catchError, concatMap, finalize, toArray } from 'rxjs/operators';
import { Routes } from 'src/app/config/routes.enum';
import { Sale } from 'src/app/interfaces/sale';
import { IPhone, Product, Stock } from 'src/app/interfaces/stock';
import { ProductSelled } from 'src/app/interfaces/sale';
import { EnviosDocService } from 'src/app/services/envios-doc.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SalesService } from 'src/app/services/sales.service';
import { StockService } from 'src/app/services/stock.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss']
})
export class NewSaleComponent {

  public codes: IPhone[] = [];
  public cases: Array<Array<Product>> = [];
  public saleForm: FormGroup;
  public cantToSell = [0];
  public showSelects = false;
  public deleteFromDrive: Product[] = [];
  public updatedModels: ProductSelled[] = [];
  @ViewChild('content') modal: ElementRef | undefined;
  @ViewChild('errroModal') errorModal: ElementRef | undefined;
  public ERROR: any;
  public newSale: Sale = {} as Sale;
  public notRegisteredSales: Array<string> = [];
  constructor(
    public firebaseService: StockService,
    private salesService: SalesService,
    private loaderService: LoaderService,
    public router: Router,
    private modalService: NgbModal,
    private envios: EnviosDocService,
    private messageService: MessageService
  ) {
    this.loaderService.showLoader();
    this.firebaseService.getStockAllDocumentsName().subscribe(x => {
      this.codes = x;
      this.loaderService.hideLoader();
    });
    this.envios.getPending().subscribe(x => {
      x.data.forEach(x => {
        console.log(x);
        if (x.products === null || x.products?.length === 0) {
          this.notRegisteredSales.push(x.username);
        }
      })
    })

    const messageSale = this.messageService.getEditSale();
    this.saleForm = new FormGroup({
      client: new FormControl(messageSale?.cliente || null, Validators.required),
      sell_type: new FormControl(messageSale?.tipo_entrega || 'delivery', Validators.required),
      sale_channel: new FormControl(messageSale?.canal_venta || null, Validators.required),
      summary: new FormControl(messageSale?.total || null, Validators.required),
      payment_type: new FormControl(messageSale?.payment_type || null, Validators.required),
      products: new FormArray([
        new FormGroup({
          iphoneCode: new FormControl(null, Validators.required),
          producto: new FormControl(null, Validators.required),
          cant: new FormControl(1, Validators.required)
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

  getArrayFormGroup(i: number) {
    return this.array[i] as FormGroup;
  }

  public searchIphoneCases(index: number) {
    const formGroupValue = this.getArrayFormGroup(index).value;
    this.firebaseService.getProductStock(formGroupValue.iphoneCode).subscribe(x => {
      this.cases[index] = x.data
      this.cases[index].push(x.docId as unknown as Product);
    });
  }

  addFormGroup() {
    this.products.push(new FormGroup({
      iphoneCode: new FormControl(null, Validators.required),
      producto: new FormControl(null, Validators.required),
      cant: new FormControl(1, Validators.required)
    }))
  }

  deleteFormGroup() {
    this.array.pop();
  }

  public openModal() {
    this.modalService?.open(this.modal, { centered: true });
  }

  public openErrorModal() {
    this.modalService?.open(this.errorModal, { centered: true });
  }

  public goPending() {
    this.modalService?.dismissAll();
    this.router.navigate([Routes.SEND_PENDING])
  }

  public doSale(): void {
    this.loaderService.showLoader();
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
        const codeIndex = this.cases.findIndex(y => y[y.length - 1] === x.value.iphoneCode);
        const modelIndex = this.cases[codeIndex].findIndex(z => z.producto === x.value.producto);
        const price = this.cases[codeIndex][modelIndex].precio;
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
        if (finalResult.data[finalResult.data.length - 1] === x.value.iphoneCode) {
          finalResult.data.pop();
        }
        var updatedModel: ProductSelled = {
          cant: x.value.cant,
          producto: x.value.producto,
          iphoneCode: x.value.iphoneCode,
          precio: price
        }
        this.updatedModels.push(updatedModel);
        const fecha = new Date();

        this.newSale = {
          cliente: this.saleForm.get('client')?.value,
          tipo_entrega: this.saleForm.get('sell_type')?.value,
          total: this.saleForm.get('summary')?.value,
          productos: this.updatedModels,
          canal_venta: this.saleForm.get('sale_channel')?.value,
          payment_type: this.saleForm.get('payment_type')?.value,
          date: fecha.getDate() + '/' + fecha.getMonth()
        };
        return this.firebaseService.updateSotckAfterSale(x.value.iphoneCode, finalResult).pipe(
          catchError(error => {
            this.prepareSendPendingData(this.newSale);
            this.ERROR = error;
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
            this.ERROR = error;
            this.openErrorModal();
            this.loaderService.hideLoader();
            return error;
          }),
          finalize(() => {
            if (this.deleteFromDrive.length === 0) {
              this.router.navigate([Routes.SEND_PENDING]);
            } else {
              this.openModal();
            }
            this.loaderService.hideLoader();
          })
        ).subscribe()
      }))
      .subscribe()
  }

  public prepareSendPendingData(newSale: Sale) {
    return this.envios.addProductToOrder(newSale);
  }

  public sendAllSalesData(newSale: Sale) {
    return this.salesService.addSaleToAllSales(newSale);
  }

}
