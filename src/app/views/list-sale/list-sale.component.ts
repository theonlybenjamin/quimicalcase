import { Component, OnInit } from '@angular/core';
import { SendPending } from 'src/app/interfaces/send-pending';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-list-sale',
  templateUrl: './list-sale.component.html',
  styleUrls: ['./list-sale.component.scss']
})
export class ListSaleComponent implements OnInit {
  public orders: SendPending[] = [];
  public reversedOrders: SendPending[] = [];
  public showSends = false;
  constructor(
    public fireService: FirebaseService,
  ) {
    this.getSends();
  }

  ngOnInit(): void {
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
    this.fireService.deleteItemPendingCollection(order);
  }
}
