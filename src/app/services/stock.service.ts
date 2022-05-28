import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, take, concatMap } from 'rxjs/operators';
import { Collections } from '../config/collections';
import { ProductSelled } from '../interfaces/sale';
import { Stock, IPhone } from '../interfaces/stock';
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
    return this.afs.collection<Stock>(Collections.STOCK).doc(collection).valueChanges({ idField: 'docId' }) as Observable<Stock>;
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
  public addNewProduct(document: string, array: Stock): Observable<any> {
    return from(this.afs.collection(Collections.STOCK).doc(document).set(array)).pipe(
      map(x => true)
    );
  }

  /**
   * Metodo para resturar un producto de una venta cancelada
   * @param product  producto a restaurar
   * @returns Observable añadiendo producto
   */
  public restoreProduct(product: ProductSelled) {
    var productStock: Stock = {
      data: []
    };
    return this.getStockSpecificDocumentAlone(product.iphoneCode).pipe(
      take(1),
      concatMap(x => {
        productStock = x;
        var productIndex = productStock.data.findIndex(z => z.producto.toLowerCase() === product.producto.toLowerCase() && z.precio == product.precio);
        if (productIndex !== -1) {
          productStock.data[productIndex].cant += product.cant;
        } else {
          productStock.data.push(product);
        }
        return this.addNewProduct(product.iphoneCode, productStock);
      })
    );
  }

  /**
   * Metodo para obtener solo todos los codigos de los productos
   * @returns retorna observable con los codigos de productos
   */
  public getStockAllDocumentsName(): Observable<IPhone[]> {
    return this.afs.collection(Collections.STOCK).get().pipe(
      take(1),
      map((x) => {
        var a: IPhone[] = [];
        x.docs.forEach(x => {
          let objectTemp = { id: x.id, name: iphoneNameById(x.id) }
          a.push(objectTemp)
        });
        return a;
      })
    );
  }

  /**
   * Metodo para obtener todos el stock de productos
   * @returns 
   */
  public getAllProductNames(): Observable<any> {
    return this.afs.collection(Collections.STOCK).valueChanges({ idField: 'docId' });
  }

  /**
   * Metodo para actualizar productos de una venta
   * @param document 
   * @param data 
   * @returns 
   */
  public updateSotckAfterSale(document: string, data: Stock): Observable<any> {
    return from(this.afs.collection(Collections.STOCK).doc(document).update(data));
  }


}
