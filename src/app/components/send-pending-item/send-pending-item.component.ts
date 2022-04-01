import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sale } from 'src/app/interfaces/sale';
import { FirebaseService } from 'src/app/services/firebase.service';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-send-pending-item',
  templateUrl: './send-pending-item.component.html',
  styleUrls: ['./send-pending-item.component.scss']
})
export class SendPendingItemComponent implements OnInit {

  @Input() summaryText: string = '';
  @Input() orders: Array<Sale> = [];
  @Input() showButton: boolean = true;
  @Input() textButton: string = '';
  @Input() showButton2: boolean = false;
  @Input() textButton2: string = '';
  @Input() showTotal: boolean = false;
  @Output() actionButton1 = new EventEmitter<Sale>();
  @Output() actionButton2 = new EventEmitter<Sale>();
  public packagingPrice: number = 5;
  public advertisingPrice: number = 3.5;
  public totalSummary: number = 0;
  public salary: number = 0;
  public reinvesment: number = 0;
  public advertisement: number = 0;
  constructor(
    public fireService: FirebaseService
    ) { }

  ngOnInit(): void {
    this.orders.forEach(x => this.totalSummary += (x.total? x.total : 0));
  }

  public getExpensesSummary(order: Sale): number {
    return (order.capital? order.capital : 0) + this.packagingPrice + this.advertisingPrice;
  }

  public getProfit(order: Sale): number {
    const total = new Decimal(order.total? order.total : 0);
    const expenses = new Decimal(this.getExpensesSummary(order))
    return total.minus(expenses).toNumber();
  }

  public emitButton1(order: Sale) {
    this.actionButton1.emit(order);
  }

  public emitButton2(order: Sale) {
    this.actionButton2.emit(order);
  }
}
