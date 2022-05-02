import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { FirebaseService } from 'src/app/services/firebase.service';
import { codeForStorage } from 'src/app/utils/utils';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit, OnDestroy {
  uploadPercent: any;
  public model: string = '';
  public productType: string = '';
  @ViewChild('successModal') successModal: ElementRef | undefined;
  public subscription = new Subscription();
  constructor(
    private storage: AngularFireStorage,
    private fireService: FirebaseService,
    private modalService: NgbModal,
    private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public async uploadFile(file: any) {
    const fileEnd = file.files[0] as File;
    const filePath = `${codeForStorage(this.productType)}${this.model}.jpg`;
    const newFile = await imageCompression(fileEnd, { fileType: 'image/jpeg', maxSizeMB: 1.2 });
    console.log(newFile);
    const task = this.storage.upload(filePath, newFile);
    this.fireService.showLoader();
    this.subscription.add(task.percentageChanges().pipe(
        map(x => this.uploadPercent = x),
        finalize(() => {
          this.fireService.hideLoader();
          this.modalService?.open(this.successModal, {centered: true});
        }),
        catchError(error => {
          alert(error);
          return error;
        })
      ).subscribe());
  }

  public reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.modalService.dismissAll();
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }
}
