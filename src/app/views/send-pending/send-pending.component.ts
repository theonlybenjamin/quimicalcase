import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
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
  public historic: Array<IPending> = [];
  public historicClient: string = '';
  @ViewChild('successModal') successModal: ElementRef | undefined;
  constructor(
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private enviosService: EnviosDocService
  ) {
    this.getSends();
    this.getHistoricSends();
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

  public getHistoricSends() {
    this.enviosService.getHisotric().subscribe(x => {
      this.historic = x.data;
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

  public registerHistoricClient() {
    this.loaderService.showLoader();
    const user = this.historic.find(x => x.username === this.historicClient);
    if (user) {
      this.enviosService.addOrderToPendingList(user).pipe(
        finalize(() => this.loaderService.hideLoader())
      ).subscribe()
    }
  }
}
