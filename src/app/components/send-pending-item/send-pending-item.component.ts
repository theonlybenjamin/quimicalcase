import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendPending } from 'src/app/interfaces/send-pending';
import { FirebaseService } from 'src/app/services/firebase.service';

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
  @ViewChild('successModal') successModal: ElementRef | undefined;;
  constructor(
    public fireService: FirebaseService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  public completeOrder(order: SendPending) {
    this.selectedOrder = order;
    this.modalService.open(this.successModal, {centered: true});
  }

  public confirmCompleteOrder() {
    this.fireService.deleteItemPendingCollection(this.selectedOrder);
    this.modalService.dismissAll();
  }
}
