import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';
import { concatMap, finalize } from 'rxjs/operators';
import { Sale, SaleArray } from 'src/app/interfaces/sale';
import { LoaderService } from 'src/app/services/loader.service';
import { MessageService } from 'src/app/services/message.service';
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
  @ViewChild('addLogisticModal') addLogisticModal: ElementRef | undefined;
  public justDevVar: SaleArray = {
    data: []
  };
  public months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public selectedMonth: number = 0;
  public logisticExpense = 0;

  constructor(
    public fireService: StockService,
    private modalService: NgbModal,
    private loaderService: LoaderService,
    private salesService: SalesService,
    private messageService: MessageService,
  ) {
    this.loaderService.showLoader();
    this.actualMonth = (new Date().getMonth() + 1);
    this.getAllSaleForMonth(getMonthOnSalesDOC(this.actualMonth));
  }


  public getAllSaleForMonth(doc: string) {
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
    this.selectedMonth = Number($event);
    this.getAllSaleForMonth(getMonthOnSalesDOC(Number($event)));
  }

  public deleteSale(order: Sale) {
    this.selectedOrder = order;
    this.messageService.openModal({
      title: 'Cancelar pedido',
      body: `¿Segura que quieres cancelar el pedido <b>${order.client || 'Cliente no identificado'}</b>?`,
      button1Action: this.confirmDelete.bind(this),
      button1Text: 'S\xed',
      button2Text: 'No'
    })
  }

  public confirmDelete() {
    this.modalService.dismissAll();
    this.loaderService.showLoader();
    this.salesService.deleteSale(this.selectedOrder, this.selectedMonth ? this.selectedMonth : 0).subscribe();
    from(this.selectedOrder.products)
      .pipe(
        concatMap(productToRestore => this.fireService.restoreProduct(productToRestore)),
        finalize(() => this.loaderService.hideLoader())
      ).subscribe();
  }

  public confirmAddLogisticExpense() {
    this.modalService.dismissAll();
    this.loaderService.showLoader();
    this.salesService
      .addLogisticExpense(this.selectedOrder, this.logisticExpense, this.selectedMonth ? this.selectedMonth : 0)
      .subscribe();
  }

  showAddLogisticExpenses(order: Sale) {
    this.selectedOrder = order;
    this.modalService.open(this.addLogisticModal, { centered: true });
  }
}
