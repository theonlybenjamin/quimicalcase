import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendPending } from 'src/app/interfaces/send-pending';
import { FirebaseService } from 'src/app/services/firebase.service';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-send-pending-item',
  templateUrl: './send-pending-item.component.html',
  styleUrls: ['./send-pending-item.component.scss']
})
export class SendPendingItemComponent implements OnInit {

  @Input() summaryText: string = '';
  @Input() orders: SendPending[] = [];
  @Input() showButton: boolean = true;
  public selectedOrder: SendPending = {} as SendPending;
  @Input() showTotal: boolean = false;
  @ViewChild('successModal') successModal: ElementRef | undefined;
  public packagingPrice: number = 5;
  public advertisingPrice: number = 3.5;
  public totalSummary: number = 0;
  public salary: number = 0;
  public reinvesment: number = 0;
  public advertisement: number = 0;
  constructor(
    public fireService: FirebaseService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.orders.forEach(x => this.totalSummary += (x.total? x.total : 0));
    this.salary = Number(new Decimal(this.totalSummary * 0.35).toPrecision(4));
    this.reinvesment = Number(new Decimal(this.totalSummary * 0.50).toPrecision(4));
    this.advertisement = Number(new Decimal(this.totalSummary * 0.15).toPrecision(4));

  }

  public completeOrder(order: SendPending) {
    this.selectedOrder = order;
    this.modalService.open(this.successModal, {centered: true});
  }

  public confirmCompleteOrder() {
    this.fireService.deleteItemPendingCollection(this.selectedOrder);
    this.modalService.dismissAll();
  }

  public getExpensesSummary(order: SendPending): number {
    return (order.costo_delivery? order.costo_delivery : 0) + (order.capital? order.capital : 0) + this.packagingPrice + this.advertisingPrice;
  }

  public getProfit(order: SendPending): number {
    const total = new Decimal(order.total? order.total : 0);
    const expenses = new Decimal(this.getExpensesSummary(order))
    return total.minus(expenses).toNumber();
  }
}
