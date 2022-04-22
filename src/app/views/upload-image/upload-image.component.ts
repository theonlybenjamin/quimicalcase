import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
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
  constructor(
    private storage: AngularFireStorage) { }

  ngOnInit(): void {
  }

  public async uploadFile(file: any){
    const fileEnd = file.files[0] as File;
    console.log(fileEnd);
    for(let i = 0; i < this.array.length ;i++) {
      const filePath = `${this.array[i]}${this.model}.jpg`;
      const task = this.storage.upload(filePath, fileEnd);
      task.percentageChanges().subscribe(x =>{
        console.log(x)
        this.uploadPercent = x;
      });
      task.catch(x =>{
        alert(x);
      })
      console.log('terminamos')
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
