import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalInterface } from 'src/app/interfaces/modal.interface';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent {
  @ViewChild('content') htmlModal: any;
  public modalContent!: ModalInterface
  constructor(
    private modalService: NgbModal,
    private sharedData: MessageService
  ) {
    this.sharedData.openModalSubscribe(x => {
      this.modalContent = x;
      if (!this.modalContent.hasOwnProperty('button1Action')) {
        const func = () => {};
        this.modalContent.button1Action = func.bind(this);
      }
      this.openModal();
    });

    this.sharedData.closeModalSubscribe(x => {
      if (x) this.closeModal();
    })
  }

  openModal() {
    this.modalService.open(this.htmlModal, { windowClass: 'dark-modal', centered: true });
  }

  closeModal() {
    this.modalService.dismissAll();
  }
}
