import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { concatMap, finalize, map, take } from 'rxjs/operators';
import { Collections } from '../config/collections';
import { Documents } from '../config/documents';
import { IPending, IPendingArray } from '../interfaces/envios.interface';
import { Sale } from '../interfaces/sale';
import { LoaderService } from './loader.service';
import { isEqual } from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class EnviosDocService {

  constructor(
    private readonly afs: AngularFirestore,
    private loaderService: LoaderService
  ) { }

  /**
   * Metodo para obtener los pendientes de envío
   * @returns mock
   */
  public getPending(): Observable<IPendingArray> {
    return this.afs.collection<IPendingArray>(Collections.ENVIOS).doc(Documents.PENDIENTES).valueChanges() as Observable<IPendingArray>;
  }

  /**
   * Metodo para obtener los pendientes de envío
   * @returns mock
   */
  public getHisotric(): Observable<IPendingArray> {
    return this.afs.collection<IPendingArray>(Collections.ENVIOS).doc(Documents.HISTORIC).valueChanges() as Observable<IPendingArray>;
  }

  /**
   * Metodo para setear los pendientes de envio
   * @param newOrder - venta a agregar
   * @returns 
   */
  public addProductToOrder(newOrder: Sale): Observable<IPendingArray> {
    this.loaderService.showLoader();
    var array: IPendingArray = {
      data: []
    };
    return this.getPending().pipe(
      take(1),
      map(x => {
        array = x;
        const index = array.data.findIndex(y => y.username === newOrder.cliente);
        if (index !== -1) {
          array.data[index].products = newOrder.products;
        }
        return x;
      }),
      finalize(() => {
        this.afs.collection(Collections.ENVIOS).doc(Documents.PENDIENTES).set(array);
        this.loaderService.hideLoader();
      })
    )
  }

  /**
   * Metodo para setear los pendientes de envio
   * @param newOrder - venta a agregar
   * @returns 
   */
  public addOrderToPendingList(newOrder: IPending): Observable<IPendingArray> {
    this.loaderService.showLoader();
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
        this.loaderService.hideLoader();
      })
    )
  }

  /**
   * Metodo para setear en el historico
   * @param newOrder - venta a agregar
   * @returns 
   */
  public addOrderToHistoricList(newOrder: IPending): Observable<IPendingArray> {
    this.loaderService.showLoader();
    var array: IPendingArray = {
      data: []
    };
    return this.getHisotric().pipe(
      take(1),
      map(x => {
        array = x
        array.data.push(newOrder);
        return x;
      }),
      finalize(() => {
        this.afs.collection(Collections.ENVIOS).doc(Documents.HISTORIC).set(array);
        this.loaderService.hideLoader();
      })
    )
  }

  /**
   * Metodo para eliminar una venta de la lista de pendientes de envio
   * @param order - venta a eliminar
   * @returns 
   */
  public deleteOrderOfPendingList(order: IPending) {
    var pendingList: IPendingArray = {
      data: []
    };
    return this.getPending().pipe(
      take(1),
      concatMap((x) => {
        pendingList = x;
        const index = pendingList.data.findIndex(y => isEqual(y, order));
        pendingList.data.splice(index, 1);

        return this.afs.collection(Collections.ENVIOS).doc(Documents.PENDIENTES).set(pendingList);
      })
    )
  }

  /**
   * Metodo para eliminar una venta de la lista de pendientes de envio
   * @param order - venta a eliminar
   * @returns 
   */
  public historicToPending(username: string) {

    return this.getPending().pipe(
      take(1),
      concatMap((x) => {
        const order = x.data.find(y => y.username === username) as IPending;
        if (order) {

          return this.deleteOrderOfPendingList(order)
            .pipe(
              concatMap(() => {
                order.products = [];
                return this.addOrderToPendingList(order)
              })
            )
        }

        return this.getHisotric().pipe(
          take(1),
          concatMap(y => {
            const order = y.data.find(y => y.username === username) as IPending;
            return this.deleteOrderOfPendingList(order)
              .pipe(
                concatMap(() => {
                  order.products = [];

                  return this.addOrderToPendingList(order)
                })
              )
          })
        )
      })
    )
  }
}
