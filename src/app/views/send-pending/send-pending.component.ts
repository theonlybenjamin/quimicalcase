import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { SendPending } from 'src/app/interfaces/send-pending';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-send-pending',
  templateUrl: './send-pending.component.html',
  styleUrls: ['./send-pending.component.scss']
})
export class SendPendingComponent implements OnInit {

  public orders: SendPending[] = [];
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
    this.fireService.getSendPending().subscribe(x => {
      this.orders = []
      for (let i = 0; i < x.data.length; i++) {
          this.orders[i] = x.data[i];
      }
      this.showSends = true;
    });
  }
  public completeOrder(order: SendPending) {
    this.fireService.deleteItemPendingCollection(order);
  }
}
