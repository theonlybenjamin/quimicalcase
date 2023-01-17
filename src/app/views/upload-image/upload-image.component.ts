import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { catchError, finalize, map, take } from 'rxjs/operators';
import { codeForStorage } from 'src/app/utils/utils';
import imageCompression from 'browser-image-compression';
import { LoaderService } from 'src/app/services/loader.service';
import { StockService } from 'src/app/services/stock.service';
import { IFirebaseDocument, IProduct } from 'src/app/interfaces/stock';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnDestroy {
  public codes: IFirebaseDocument[] = [];
  public productsName: Array<IProduct> = [];
  uploadPercent: any;
  public productName: string = '';
  public productType: string = '';
  @ViewChild('successModal') successModal: ElementRef | undefined;
  public subscription = new Subscription();
  public imagePreview: any;
  public productHasImage: boolean = false;

  constructor(
    private storage: AngularFireStorage,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private stockHttpService: StockService,
    private router: Router
  ) {
    this.stockHttpService.getStockAllDocumentsName().subscribe(x => this.codes = x);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public uploadFile(file: any) {
    const imageCompressionOptions = { fileType: 'image/jpeg', maxSizeMB: 1.2, useWebWorker: false }
    const fileToUpload = file.files[0] as File;
    const fileName = this.productName.replace(/\s+/g, '-').toLowerCase();
    const destinationToUpload = `${codeForStorage(this.productType)}${fileName}.jpg`;

    imageCompression(fileToUpload, imageCompressionOptions)
      .then(newFile => {
        var reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e?.target?.result;
        };
        reader.readAsDataURL(newFile);
        const task = this.storage.upload(destinationToUpload, newFile);
        this.loaderService.showLoader();
        this.subscription.add(
          task.percentageChanges()
            .pipe(
              map(x => this.uploadPercent = x),
              finalize(() => {
                this.loaderService.hideLoader();
                this.modalService?.open(this.successModal, { centered: true });
              }),
              catchError(error => {
                alert(error);
                return error;
              })
            )
            .subscribe());
      });
  }

  public reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.modalService.dismissAll();
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => {
        this.router.navigate([currentUrl]);
      });
  }

  public listProductsName(value: any) {
    this.productType = value.target.value;
    this.subscription.add(
      this.stockHttpService.getProductStock(this.productType)
        .pipe(
          map(products => this.productsName = products.data)
        )
        .subscribe()
    );
  }

  public verifyIfAlreadyHasPhoto(value: any) {
    this.loaderService.showLoader();
    this.productName = (value.target.value as string).replace(/\s+/g, '-').toLowerCase();
    const destinationToUpload = `${codeForStorage(this.productType)}${this.productName}.jpg`.slice(1);
    this.storage.ref(
      codeForStorage(this.productType)
    )
      .listAll()
      .pipe(
        take(1),
        finalize(() => this.loaderService.hideLoader())
      )
      .subscribe(picturesDataGroup => {
        this.productHasImage = picturesDataGroup.items
          .some(pictureData =>
            pictureData.fullPath === destinationToUpload
          );
      });
  }
}
