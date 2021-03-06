import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { concatMap, finalize, map, take } from 'rxjs/operators';
import { Collections } from '../config/collections';
import { Documents } from '../config/documents';
import { IPending, IPendingArray } from '../interfaces/envios.interface';
import { Sale } from '../interfaces/sale';
import { LoaderService } from './loader.service';

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
          array.data[index].products = newOrder.productos;
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
        const searchObject = this.searchItemToDelete(pendingList, order)
        const indexToDelete = pendingList.data.indexOf(searchObject);
        pendingList.data.splice(indexToDelete, 1);
        
        return this.afs.collection(Collections.ENVIOS).doc(Documents.PENDIENTES).set(pendingList);
      })
    )
  }

  /**
   * Funcion para buscar el objeto
   * @param array - donde se hará la busqueda
   * @param order - el objeto que se buscara
   * @returns la orden buscada
   */
  public searchItemToDelete(array: IPendingArray, order: IPending): IPending {
    return array.data.find(x => {
      if (x.username === order.username && x.documentNumber === order.documentNumber) {
        if (order.products?.length > 0) {
          for (let i = 0; i < x.products.length; i++) {
            if (x.products[i].iphoneCode === order.products[i].iphoneCode && x.products[i].producto === order.products[i].producto) {
              return x;
            }
            return undefined;
          }
        }
        return x;
      }
        return undefined;
    }) as IPending;
  }
}
