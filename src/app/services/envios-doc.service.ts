import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, map, take } from 'rxjs/operators';
import { Collections } from '../config/collections';
import { Documents } from '../config/documents';
import { IPending, IPendingArray } from '../interfaces/envios.interface';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class EnviosDocService {

  constructor(
    private readonly afs: AngularFirestore,
    private fireService: FirebaseService
  ) { }

  /**
   * Metodo para obtener los pendientes de envío
   * @returns mock
   */
   public getPending(): Observable<IPendingArray> {
    return this.afs.collection<IPendingArray>(Collections.ENVIOS).doc(Documents.PENDIENTES).valueChanges() as Observable<IPendingArray>;
  }

  /**
   * Metodo para setear los pendientes de envio
   * @param newOrder - venta a agregar
   * @returns 
   */
   public addOrderToPendingList(newOrder: IPending): Observable<IPendingArray> {
    this.fireService.showLoader();
    var array: IPendingArray = {
      data: []
    };
    return this.getPending().pipe(
      take(1),
      map(x => {
        array = x
        array.data.push(newOrder);
        return x;
      }),
      finalize(() => {
        this.afs.collection(Collections.ENVIOS).doc(Documents.PENDIENTES).set(array);
        this.fireService.hideLoader();
      })
    )
  }
}
