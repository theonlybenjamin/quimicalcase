import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendPending, SendPendingArray } from 'src/app/interfaces/send-pending';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-list-sale',
  templateUrl: './list-sale.component.html',
  styleUrls: ['./list-sale.component.scss']
})
export class ListSaleComponent {

  public orders: SendPending[] = [];
  public reversedOrders: SendPending[] = [];
  public showSends = false;
  public selectedOrder: SendPending = {} as SendPending;
  public actualMonth: number;
  @ViewChild('successModal') successModal: ElementRef | undefined;
  public justDevVar: SendPendingArray = {
    data: []
  };
  constructor(
    public fireService: FirebaseService,
    private modalService: NgbModal
  ) {
    this.fireService.showLoader();
    this.actualMonth = (new Date().getMonth() + 1);
    this.getSends(this.getMonthOnSalesDOC(this.actualMonth));
  }

  public getSends(doc: string) {
    this.showSends = false;
    this.fireService.getAllSales(doc).subscribe(x => {
      this.orders = []
      for (let i = 0; i < x.data.length; i++) {
          this.justDevVar = x;
          this.orders[i] = x.data[i];
        }
      this.reversedOrders = this.orders.slice().reverse();
      this.showSends = true;
      this.fireService.hideLoader();
    });
  }

  public getMonthOnSalesDOC(month: number) {
    switch (month) {
      case 1: return 'ventas_enero';
      case 2: return 'ventas_febrero';
      case 3: return 'ventas_marzo';
      case 4: return 'ventas_abril';
      case 5: return 'ventas_mayo';
      case 6: return 'ventas_junio'; 
      case 7: return 'ventas_julio';
      case 8: return 'ventas_agosto';
      case 9: return 'ventas_setiembre';
      case 10: return 'ventas_octubre';
      case 11: return 'ventas_noviembre';
      case 12: return 'ventas_diciembre';
      default: return month.toString();
      }
  }

  public changeMonth($event: string) {
    this.getSends(this.getMonthOnSalesDOC(Number($event)));
  }

  public completeOrder(order: SendPending) {
    this.selectedOrder = order;
    this.modalService.open(this.successModal, {centered: true});
  }

  public confirmDelete() {
    this.modalService.dismissAll();
    this.fireService.deleteItemSalesCollection(this.selectedOrder).subscribe();
  }
}
