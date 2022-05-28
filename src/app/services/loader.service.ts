import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loader: boolean = false;

  constructor() { }

  public showLoader(){
    this.loader = true
  };

  public hideLoader(){
    this.loader = false;
  };

  public getLoaderStatus() {
    return this.loader;
  }
}
