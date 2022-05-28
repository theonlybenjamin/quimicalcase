import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';
import { concatMap, finalize } from 'rxjs/operators';
import { Sale, SaleArray } from 'src/app/interfaces/sale';
import { ProductSelled } from 'src/app/interfaces/sale';
import { LoaderService } from 'src/app/services/loader.service';
import { SalesService } from 'src/app/services/sales.service';
import { StockService } from 'src/app/services/stock.service';
import { getMonthOnSalesDOC } from 'src/app/utils/utils';

@Component({
  selector: 'app-list-sale',
  templateUrl: './list-sale.component.html',
  styleUrls: ['./list-sale.component.scss']
})
export class ListSaleComponent {

  public orders: Sale[] = [];
  public reversedOrders: Sale[] = [];
  public showSends = false;
  public selectedOrder: Sale = {} as Sale;
  public actualMonth: number;
  @ViewChild('successModal') successModal: ElementRef | undefined;
  @ViewChild('editModal') editModal: ElementRef | undefined;
  public justDevVar: SaleArray = {
    data: []
  };
  public months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  constructor(
    public fireService: StockService,
    private modalService: NgbModal,
    private loaderService: LoaderService,
    private salesService: SalesService
  ) {
    this.loaderService.showLoader();
    this.actualMonth = (new Date().getMonth() + 1);
    this.getSends(getMonthOnSalesDOC(this.actualMonth));
  }

  public getSends(doc: string) {
    this.showSends = false;
    this.salesService.getAllSales(doc).subscribe(x => {
      this.orders = []
      for (let i = 0; i < x.data.length; i++) {
          this.justDevVar = x;
          this.orders[i] = x.data[i];
        }
      this.reversedOrders = this.orders.slice().reverse();
      this.showSends = true;
      this.loaderService.hideLoader();
    });
  }

  public changeMonth($event: string) {
    this.getSends(getMonthOnSalesDOC(Number($event)));
  }

  public deleteOrder(order: Sale) {
    this.selectedOrder = order;
    this.modalService.open(this.successModal, {centered: true});
  }

  public editOrder(order: Sale) {
    this.selectedOrder = order;
    this.modalService.open(this.editModal, {centered: true});
  }

  public confirmDelete() {
    this.modalService.dismissAll();
    this.loaderService.showLoader();
    this.salesService.deleteSale(this.selectedOrder).subscribe();
    from(this.selectedOrder.productos).pipe(
      concatMap(x => {
        var productToRestore: ProductSelled = {
          cant: x.cant,
          precio: x.precio,
          producto: x.producto,
          iphoneCode: x.iphoneCode,
        }
        return this.fireService.restoreProduct(productToRestore);
      }),
      finalize(()=> this.loaderService.hideLoader())
    ).subscribe();

  }
}
