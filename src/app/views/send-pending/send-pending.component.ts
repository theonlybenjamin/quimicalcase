import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Sale } from 'src/app/interfaces/sale';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-send-pending',
  templateUrl: './send-pending.component.html',
  styleUrls: ['./send-pending.component.scss']
})
export class SendPendingComponent {

  public orders: Array<Sale> = [];
  public reversedOrders: Array<Sale> = [];
  public showSends = false;
  public selectedOrder: Sale = {} as Sale;
  @ViewChild('successModal') successModal: ElementRef | undefined;
  constructor(
    public fireService: FirebaseService,
    private modalService: NgbModal
  ) {
    this.getSends();
  }

  public getSends() {
    this.fireService.showLoader();
    this.showSends = false;
    this.fireService.getSendPending().subscribe(x => {
      this.orders = []
      for (let i = 0; i < x.data.length; i++) {
          this.orders[i] = x.data[i];
        }
      this.reversedOrders = this.orders.slice().reverse();
      this.showSends = true;
      this.fireService.hideLoader();
    });
  }

  public completeOrder(order: Sale) {
    this.selectedOrder = order;
    this.modalService.open(this.successModal, {centered: true});
  }

  public confirmCompleteOrder() {
    this.modalService.dismissAll();
    this.fireService.deleteOrderOfPendingList(this.selectedOrder).subscribe();
  }
}
