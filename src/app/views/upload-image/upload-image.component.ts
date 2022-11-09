import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { codeForStorage } from 'src/app/utils/utils';
import imageCompression from 'browser-image-compression';
import { LoaderService } from 'src/app/services/loader.service';

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
  public gaa: any;
  constructor(
    private storage: AngularFireStorage,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public uploadFile(file: any) {
    const fileEnd = file.files[0] as File;
    const filePath = `${codeForStorage(this.productType)}${this.model}.jpg`;
    imageCompression(fileEnd, { fileType: 'image/jpeg', maxSizeMB: 1.2, useWebWorker: false }).then(newFile => {
      var reader = new FileReader();

      reader.onload = (e) => {
      this.gaa = e?.target?.result;
    };

    reader.readAsDataURL(newFile);
      const task = this.storage.upload(filePath, newFile);
      this.loaderService.showLoader();
      this.subscription.add(task.percentageChanges().pipe(
          map(x => this.uploadPercent = x),
          finalize(() => {
            this.loaderService.hideLoader();
            this.modalService?.open(this.successModal, {centered: true});
          }),
          catchError(error => {
            alert(error);
            return error;
          })
        ).subscribe());
    }).catch(x => console.log('error', x));
  }

  public reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.modalService.dismissAll();
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }
}
