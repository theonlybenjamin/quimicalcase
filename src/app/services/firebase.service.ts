import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { finalize, map, take, tap } from 'rxjs/operators';
import { SendPending, SendPendingArray } from '../interfaces/send-pending';
import { IPhone, Stock } from '../interfaces/stock';
import { AngularFireAuth } from '@angular/fire/auth';
import { FinancesDoc } from '../interfaces/finances';
import { getMonthOnFinaceDOC, getMonthOnSalesDOC, iphoneNameById } from '../utils/utils';

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
  public mock2: SendPendingArray = {} as SendPendingArray;
  public isLogged = false;
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
  public login(user: string, pass: string) {
    return from(this.auth.signInWithEmailAndPassword(user, pass)).pipe(
      tap(x => this.isLogged = true)
    )
  }

  /**
   * Metodo para realizar el cierre de sesión
   */
  public closeSession() {
    return from(this.auth.signOut()).pipe(
      tap(x => this.isLogged = false)
    )

  }

  /**
   * Metodo para obtener los pendientes de envío
   * @returns mock
   */
  public getSendPending(): Observable<SendPendingArray> {
    return this.afs.collection<SendPendingArray>('ventas').doc('pendientes_envio').valueChanges() as Observable<SendPendingArray>;
  }

  /**
   * Metodo para obtener todas las ventas
   * @param doc  - el documento a consultar
   * @returns 
   */
  public getAllSales(doc: string): Observable<SendPendingArray> {
    return this.afs.collection<SendPendingArray>('ventas').doc(doc).valueChanges() as Observable<SendPendingArray>;
  }

  /**
   * Metodo para obtener el documento de finanzas
   * @param doc  - mes a consultar
   * @returns 
   */
  public getFinances(doc: string): Observable<FinancesDoc> {
    return this.afs.collection<FinancesDoc>('finanzas').doc(doc).valueChanges() as Observable<FinancesDoc>;
  }

  /**
   * Metodo para agregar un nuevo gasto
   * @param doc  - mes a consultar
   * @param array - el arreglo a setear
   * @returns 
   */
  public setNewExpense(document: string, array: FinancesDoc): Observable<any>{
    this.showLoader();
    return from(this.afs.collection('finanzas').doc(document).set(array)).pipe(
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
        this.afs.collection('finanzas').doc(getMonthOnFinaceDOC(this.actualMonth)).set(array);
        this.hideLoader();
      })
    )
  }

  /**
   * 
   * @param collection 
   * @returns 
   */
  public getStockSpecificDocument(collection: string): Observable<Stock> {
    return this.afs.collection<Stock>('stock').doc(collection).valueChanges({ idField: 'docId' }) as Observable<Stock>;
  }

  public getStockSpecificDocumentAlone(collection: string): Observable<Stock> {
    return this.afs.collection<Stock>('stock').doc(collection).valueChanges() as Observable<Stock>;
  }

  public setNewProduct(document: string, array: Stock): Observable<any>{
    return from(this.afs.collection('stock').doc(document).set(array)).pipe(
      map(x => true)
    );
  }

  public getStockAllDocumentsName(): Observable<IPhone[]> {
    return this.afs.collection('stock').get().pipe(
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

  public getStockAllDocuments(): Observable<any> {
    return this.afs.collection('stock').valueChanges({ idField: 'docId' });
  }

  public setFieldsStockCollection(document: string, data: Stock): Observable<any> {
    return from(this.afs.collection('stock').doc(document).update(data));
  }

  public setSendPendingColecction(dataBack: SendPending): Observable<SendPendingArray> {
    this.showLoader();
    var array: SendPendingArray = {
      data: []
    };
    return this.getSendPending().pipe(
      take(1),
      map(x => {
        array = x
        array.data.push(dataBack);
        return x;
      }),
      finalize(() => {
        this.afs.collection('ventas').doc('pendientes_envio').set(array);
        this.hideLoader();
      })
    )
  }

  public setAllSalesCollecction(dataBack: SendPending): Observable<SendPendingArray> {
    this.showLoader();
    var array: SendPendingArray = {
      data: []
    };
    return this.getAllSales(getMonthOnSalesDOC(this.actualMonth)).pipe(
      take(1),
      map(x => {
        array = x
        array.data.push(dataBack);
        return x;
      }),
      finalize(() => {
        this.afs.collection('ventas').doc(getMonthOnSalesDOC(this.actualMonth)).set(array);
        this.hideLoader();
      })
    );
  }

  public deleteItemPendingCollection(order: SendPending) {
    var array: SendPendingArray = {
      data: []
    };
    return this.getSendPending().pipe(
      take(1),
      map((x) => {
        array = x;
        const searchObject = array.data.find(x => {
          if (x.cliente === order.cliente && x.tipo_entrega === order.tipo_entrega) {
            for (let i = 0; i < x.productos.length; i++) {
              if (x.productos[i].code === order.productos[i].code && x.productos[i].model === order.productos[i].model
                && x.productos[i].index === order.productos[i].index) {
                return x;
              } else {
                return undefined;
              }
            }
          }
            return undefined;
        }) as SendPending;
        const indexToDelete = array.data.indexOf(searchObject);
        array.data.splice(indexToDelete, 1);
      }),
      finalize(() => this.afs.collection('ventas').doc('pendientes_envio').set(array))
    )
  }

  public deleteItemSalesCollection(order: SendPending) {
    var array: SendPendingArray = {
      data: []
    };
    return this.getAllSales(getMonthOnSalesDOC(this.actualMonth)).pipe(
      take(1),
      map(x => {
        array = x;
        const searchObject = array.data.find(x => {
          if (x.cliente === order.cliente && x.tipo_entrega === order.tipo_entrega) {
            for (let i = 0; i < x.productos.length; i++) {
              if (x.productos[i].code === order.productos[i].code && x.productos[i].model === order.productos[i].model
                && x.productos[i].index === order.productos[i].index) {
                return x;
              } else {
                return undefined;
              }
            }
          }
            return undefined;
        }) as SendPending;
        const indexToDelete = array.data.indexOf(searchObject);
        array.data.splice(indexToDelete, 1);
      }),
      finalize(() => this.afs.collection('ventas').doc(getMonthOnSalesDOC(this.actualMonth)).set(array))
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
