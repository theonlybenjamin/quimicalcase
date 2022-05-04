import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  protected observable = new Subject<string>();

  constructor() { }

  public next(item: string) {
    this.observable.next(item);
  }

  public subscribe(callback: (item:string)=>void) {
    this.observable.subscribe(callback);
  }
}
