import { Component, Input, OnInit } from '@angular/core';
import { SendPending } from 'src/app/interfaces/send-pending';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-send-pending-item',
  templateUrl: './send-pending-item.component.html',
  styleUrls: ['./send-pending-item.component.scss']
})
export class SendPendingItemComponent implements OnInit {

  @Input() orders: SendPending[] = [];
  constructor(public fireService: FirebaseService) { }

  ngOnInit(): void {
  }

  public completeOrder(order: SendPending) {
    this.fireService.deleteItemPendingCollection(order);
  }
}
