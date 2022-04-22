import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { codeForStorage } from 'src/app/utils/utils';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {
  uploadPercent: number | undefined;
  public array: Array<string> = [];
  public model: string = '';
  constructor(
    private storage: AngularFireStorage) { }

  ngOnInit(): void {
  }

  public uploadFile(file: any){
    const fileEnd = file.target?.files[0] as File;
    for(let i = 0; i < this.array.length ;i++) {
      const filePath = `${this.array[i]}${this.model}`;
      const task = this.storage.upload(filePath, fileEnd);
      task.percentageChanges().subscribe(x =>{
        this.uploadPercent = x;
      });
      task.catch(x =>{
        alert(x);
      })
    }
  }

  addCarpetStorage(carpet: string){
    if (this.array.includes(carpet)) {
        this.array = this.array.filter(x => x !== carpet)
    } else {
      this.array.push(carpet);
    }
  }
}
