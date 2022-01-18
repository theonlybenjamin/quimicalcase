import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { }
  
  public setStorage(storage: string, value: string): any {
    return localStorage.setItem(storage, JSON.stringify(value));
  }
  
  public getStorage(storage: string): any {
    return JSON.parse(localStorage.getItem(storage) as any);
  }

  public getStock() {

  }
}
