import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { concatMap, finalize, map, take } from 'rxjs/operators';
import { ProductSelled, Sale, SaleArray } from '../interfaces/sale';
import { IPhone, Product, Stock } from '../interfaces/stock';
import { AngularFireAuth } from '@angular/fire/auth';
import { FinancesDoc } from '../interfaces/finances';
import { getMonthOnFinaceDOC, getMonthOnSalesDOC, iphoneNameById } from '../utils/utils';
import { Documents } from '../config/documents';
import { Collections } from '../config/collections';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  public stockCollection : any;
  public mock: Stock = {
    data: [{
      producto: 'error',
      cant: 0,
      precio: 0
    }]
  };
  public mock2: SaleArray = {} as SaleArray;
  public actualMonth: number = 0;
  private loader = false;
  constructor(
    private readonly afs: AngularFirestore,
    public readonly auth: AngularFireAuth
  ) {
    this.actualMonth = new Date().getMonth() + 1;
  }
  /**
   * Metodo para hacer el logeo del usuario
   * @param user - username
   * @param pass - password
   * @returns 
   */
  public login(user: string, pass: string): Observable<any> {
    return from(this.auth.signInWithEmailAndPassword(user, pass))
  }

  /**
   * Metodo para realizar el cierre de sesión
   */
  public closeSession(): Observable<any> {
    return from(this.auth.signOut())

  }

  /**
   * Metodo para obtener los pendientes de envío
   * @returns mock
   */
  public getSendPending(): Observable<SaleArray> {
    return this.afs.collection<SaleArray>(Collections.VENTAS).doc(Documents.SEND_PENDING).valueChanges() as Observable<SaleArray>;
  }

  /**
   * Metodo para obtener todas las ventas
   * @param doc  - el documento a consultar
   * @returns 
   */
  public getAllSales(doc: string): Observable<SaleArray> {
    return this.afs.collection<SaleArray>(Collections.VENTAS).doc(doc).valueChanges() as Observable<SaleArray>;
  }

  /**
   * Metodo para obtener el documento de finanzas
   * @param doc  - mes a consultar
   * @returns 
   */
  public getFinances(doc: string): Observable<FinancesDoc> {
    return this.afs.collection<FinancesDoc>(Collections.FINANZAS).doc(doc).valueChanges() as Observable<FinancesDoc>;
  }

  /**
   * Metodo para agregar un nuevo gasto
   * @param doc  - mes a consultar
   * @param array - el arreglo a setear
   * @returns 
   */
  public setNewExpense(document: string, array: FinancesDoc): Observable<any>{
    this.showLoader();
    return from(this.afs.collection(Collections.FINANZAS).doc(document).set(array)).pipe(
      map(x => true),
      finalize(() => this.hideLoader())
    );
  }

  /**
   * Metodo para sumar uno al numero de ventas
   * @returns 
   */
  public setNewTotalSales(monto: number){
    this.showLoader();
    var array: FinancesDoc;
    return this.getFinances(getMonthOnFinaceDOC(this.actualMonth)).pipe(
      take(1),
      map(x => {
        array = x;
        array.ingresos.cantidad_ventas +=1;
        array.ingresos.monto += monto;
        return x;
      }),
      finalize(() => {
        this.afs.collection(Collections.FINANZAS).doc(getMonthOnFinaceDOC(this.actualMonth)).set(array);
        this.hideLoader();
      })
    )
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
  public addNewProduct(document: string, array: Stock): Observable<any>{
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
              var productIndex = productStock.data.findIndex(z => z.producto.toLowerCase() === product.producto.toLowerCase()&&z.precio == product.precio);
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
          let objectTemp = { id: x.id, name: iphoneNameById(x.id)}
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

  /**
   * Metodo para agregar una venta a las ventas generales
   * @param newSale - venta a agregar
   * @returns 
   */
  public addSaleToAllSales(newSale: Sale): Observable<SaleArray> {
    this.showLoader();
    var allSales: SaleArray = {
      data: []
    };
    return this.getAllSales(getMonthOnSalesDOC(this.actualMonth)).pipe(
      take(1),
      map(x => {
        allSales = x
        allSales.data.push(newSale);
        return x;
      }),
      finalize(() => {
        this.afs.collection(Collections.VENTAS).doc(getMonthOnSalesDOC(this.actualMonth)).set(allSales);
        this.hideLoader();
      })
    );
  }

  /**
   * Metodo para eliminar una venta de la lista de pendientes de envio
   * @param order - venta a eliminar
   * @returns 
   */
  public deleteOrderOfPendingList(order: Sale) {
    var pendingList: SaleArray = {
      data: []
    };
    return this.getSendPending().pipe(
      take(1),
      concatMap((x) => {
        pendingList = x;
        const searchObject = this.searchItemToDelete(pendingList, order)
        const indexToDelete = pendingList.data.indexOf(searchObject);
        pendingList.data.splice(indexToDelete, 1);
        
        return this.afs.collection(Collections.VENTAS).doc(Documents.SEND_PENDING).set(pendingList);
      })
    )
  }

  public searchItemToDelete(array: SaleArray, order: Sale): Sale {
    return array.data.find(x => {
      if (x.cliente === order.cliente && x.tipo_entrega === order.tipo_entrega) {
        for (let i = 0; i < x.productos.length; i++) {
          if (x.productos[i].iphoneCode === order.productos[i].iphoneCode && x.productos[i].producto === order.productos[i].producto) {
            return x;
          } else {
            return undefined;
          }
        }
      }
        return undefined;
    }) as Sale;
  }

  /**
   * Metodo para eliminar una venta
   * @param sale - venta a eliminar
   * @returns 
   */
  public deleteSale(sale: Sale) {
    var allSales: SaleArray = {
      data: []
    };
    var products: Array<Product>;
    return this.getAllSales(getMonthOnSalesDOC(this.actualMonth)).pipe(
      take(1),
      concatMap(x => {
        allSales = x;
        const searchObject = this.searchItemToDelete(allSales, sale);
        const indexToDelete = allSales.data.indexOf(searchObject);
        products = searchObject.productos;
        allSales.data.splice(indexToDelete, 1);
        return this.afs.collection(Collections.VENTAS).doc(getMonthOnSalesDOC(this.actualMonth)).set(allSales);
      })
    )
  }

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
