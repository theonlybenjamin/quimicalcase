import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendPending } from 'src/app/interfaces/send-pending';
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
  @ViewChild('successModal') successModal: ElementRef | undefined;
  constructor(
    public fireService: FirebaseService,
    private modalService: NgbModal
  ) {
    this.getSends();
  }

  public getSends() {
    this.showSends = false;
    this.fireService.getAllSales().subscribe(x => {
      this.orders = []
      for (let i = 0; i < x.data.length; i++) {
          this.orders[i] = x.data[i];
        }
      this.reversedOrders = this.orders.slice().reverse();
      this.showSends = true;
    });
  }

  public completeOrder(order: SendPending) {
    this.selectedOrder = order;
    this.modalService.open(this.successModal, {centered: true});
  }

  public confirmDelete() {
    this.fireService.deleteItemSalesCollection(this.selectedOrder);
    this.modalService.dismissAll();
  }
}
