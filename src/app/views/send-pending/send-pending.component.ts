import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPending } from 'src/app/interfaces/envios.interface';
import { EnviosDocService } from 'src/app/services/envios-doc.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-send-pending',
  templateUrl: './send-pending.component.html'
})
export class SendPendingComponent {

  public orders: Array<IPending> = [];
  public reversedOrders: Array<IPending> = [];
  public showSends = false;
  public selectedOrder: IPending = {} as IPending;
  @ViewChild('successModal') successModal: ElementRef | undefined;
  constructor(
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private enviosService: EnviosDocService
  ) {
    this.getSends();
  }

  public getSends() {
    this.loaderService.showLoader();
    this.showSends = false;
    this.enviosService.getPending().subscribe(x => {
      this.orders = []
      for (let i = 0; i < x.data.length; i++) {
          this.orders[i] = x.data[i];
        }
      this.reversedOrders = this.orders.slice().reverse();
      this.showSends = true;
      this.loaderService.hideLoader();
    });
  }

  public completeOrder(order: IPending) {
    this.selectedOrder = order;
    this.modalService.open(this.successModal, {centered: true});
  }

  public confirmCompleteOrder() {
    this.modalService.dismissAll();
    this.enviosService.deleteOrderOfPendingList(this.selectedOrder).subscribe();
  }
}
