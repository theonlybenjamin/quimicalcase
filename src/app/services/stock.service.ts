import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, take, concatMap, finalize, catchError, tap } from 'rxjs/operators';
import { Collections } from '../config/collections';
import { Stock, IFirebaseDocument, IProduct } from '../interfaces/stock';
import { iphoneNameById } from '../utils/utils';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(
    private readonly afs: AngularFirestore,
    private loaderService: LoaderService
  ) {
  }

  /**
   * Metodo para obtener el arreglo de stock de un producto determinado
   * @param collection - producto del cual queremos stock
   * @returns observable con el stock pedido + el codigo de iphone
   */
  public getProductStock(collection: string): Observable<Stock> {
    this.loaderService.showLoader();

    return this.afs.collection<Stock>(Collections.STOCK)
      .doc(collection)
      .valueChanges({ idField: 'docId' })
      .pipe(
        tap(x => this.loaderService.hideLoader()),
        map(x => x),
        catchError(error => {
          this.loaderService.hideLoader()
          return of(error)
        })
      )
  }

  /**
   * Metodo para obtener el arreglo de stock de un producto determinado
   * @param collection - producto del cual queremos stock
   * @returns observable
   */
  public getStockSpecificDocumentAlone(collection: string): Observable<Stock> {
    return this.afs.collection<Stock>(Collections.STOCK).doc(collection).valueChanges() as Observable<Stock>;
  }

  /**
   * Metodo setear un nuevo producto
   * @param document - producto del cual queremos stock
   * @param array - producto del cual queremos stock
   * @returns observable
   */
  public addNewProduct(document: string, array: any): Observable<any> {
    return from(this.afs.collection(Collections.STOCK).doc(document).set(array)).pipe(
      map(x => true)
    );
  }

  // public newBD(document: string) {
  //   return this.afs.collection(Collections.STOCK).doc(document).valueChanges().pipe(
  //     concatMap((productArray: any) => {

  //       productArray.data.forEach((product: any) => {
  //         product.name = product.producto;
  //         product.sell_price = product.precio;
  //         product.code = document;
  //         product.buy_price = 16;
  //         product.description = '';
  //         delete product.producto;
  //         delete product.precio;
  //       });
  //       console.log('NOW: ',productArray)
  //       return this.addNewProduct(document, productArray);
  //     }));
  // }

  public restoreProduct(product: IProduct) {

    return this.getStockSpecificDocumentAlone(product.code).pipe(
      take(1),
      concatMap(productStock => {
        var productIndex = productStock.data.findIndex(z => z.name.toLowerCase() === product.name.toLowerCase() && z.description == product.description);
        if (productIndex !== -1) {
          productStock.data[productIndex].cant = Number(Number(productStock.data[productIndex].cant) + Number(product.selectedQuantity || 0));
          delete productStock.data[productIndex].selectedQuantity;
        } else {
          productStock.data.push(product);
        }
        return this.addNewProduct(product.code, productStock);
      })
    );
  }

  public getStockAllDocumentsName(): Observable<IFirebaseDocument[]> {
    this.loaderService.showLoader();
    return this.afs.collection(Collections.STOCK).get().pipe(
      take(1),
      map((x) => {
        var a: IFirebaseDocument[] = [];
        x.docs.forEach(x => {
          let objectTemp = { id: x.id, name: iphoneNameById(x.id) };
          a.push(objectTemp)
        });
        return a;
      }),
      finalize(() => this.loaderService.hideLoader())
    );
  }

  /**
   * Metodo para actualizar productos de una venta
   * @param document
   * @param data
   * @returns
   */
  public updateSotckAfterSale(document: string, data: Stock): Observable<any> {
    this.loaderService.showLoader();
    return from(this.afs.collection(Collections.STOCK).doc(document).update(data)).pipe(
      finalize(() => this.loaderService.hideLoader())
    );
  }


}
