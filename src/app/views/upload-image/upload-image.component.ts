import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';
import { catchError, concatMap, finalize, map } from 'rxjs/operators';
import { codeForStorage } from 'src/app/utils/utils';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {
  uploadPercent: any;
  public array: Array<string> = [];
  public model: string = '';
  @ViewChild('successModal') successModal: ElementRef | undefined;

  constructor(
    private storage: AngularFireStorage,
    private modalService: NgbModal,
    private router: Router) { }

  ngOnInit(): void {
  }

  public uploadFile(file: any){
    const fileEnd = file.files[0] as File;
    console.log(fileEnd);
    from(this.array).pipe(
      concatMap(x => {
        const filePath = `${x}${this.model}.jpg`;
        const task = this.storage.upload(filePath, fileEnd);
        return task.percentageChanges().pipe(
          map(x => this.uploadPercent = x),
          catchError(error => {
            alert(error);
            return error;
          })
        )        
      }),
      finalize(() => {
        this.modalService?.open(this.successModal, {centered: true});
      })
    ).subscribe();
  }

  addCarpetStorage(carpet: string){
    if (this.array.includes(carpet)) {
        this.array = this.array.filter(x => x !== carpet)
    } else {
      this.array.push(carpet);
    }
  }

  public reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }
}
