import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { finalize, map, take, tap } from 'rxjs/operators';
import { StockCollections } from '../enums/stock-collections.enum';
import { SendPending, SendPendingArray } from '../interfaces/send-pending';
import { IPhone, Stock } from '../interfaces/stock';
import { AngularFireAuth } from '@angular/fire/auth';
import { FinancesDoc } from '../interfaces/finances';
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
    return this.getFinances(this.getMonthOnFinaceDOC(this.actualMonth)).pipe(
      take(1),
      map(x => {
        array = x;
        array.ingresos.cantidad_ventas +=1;
        array.ingresos.monto += monto;
        return x;
      }),
      finalize(() => {
        this.afs.collection('finanzas').doc(this.getMonthOnFinaceDOC(this.actualMonth)).set(array);
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
          let objectTemp = { id: x.id, name: this.nameById(x.id)}
          a.push(objectTemp)
        });
        return a;
      })
    );
  }

  public getStockAllDocuments(): Observable<any> {
    return this.afs.collection('stock').valueChanges({ idField: 'docId' });
  }

  public nameById(id: string) {
    switch(id){
      case StockCollections.IPhone11: return 'IPhone 11';
      case StockCollections.IPhone11Pro: return 'Iphone 11 Pro';
      case StockCollections.IPhone11ProMax: return 'Iphone 11 Pro Max';
      case StockCollections.IPhone12: return 'Iphone 12/12pro';
      case StockCollections.IPhone12Mini: return 'Iphone 12 Mini';
      case StockCollections.IPhone12ProMax: return 'Iphone 12 Pro Max';
      case StockCollections.IPhoneXS: return 'IPhone X/XS';
      case StockCollections.IPhoneXSMax: return 'IPhone XS Max';
      case StockCollections.IPhoneXR: return 'IPhone XR';
      case StockCollections.IPhone13: return 'Iphone 13';
      case StockCollections.IPhone13Pro: return 'IPhone 13 Pro';
      case StockCollections.IPhone13ProMax: return 'Iphone 13 Pro Max';
      case StockCollections.IPhone13Mini: return 'IPhone 13 Mini';
      case StockCollections.IPhoneSE: return 'IPhone 7/8/SE2020';
      case StockCollections.IPhone8plus: return 'IPhone 7/8 plus';
      case StockCollections.AirpodsPro: return 'Airpods Pro / Airpods 3er gen';
      case StockCollections.Airpods1era: return 'Airpods 1era gen / 2da gen';
      case StockCollections.Cable: return 'Cable';
      default: return id;
    }
  }

  public idByName(id: string) {
    switch(id){
      case 'IPhone 11': return StockCollections.IPhone11;
      case 'Iphone 11 Pro': return StockCollections.IPhone11Pro;
      case 'Iphone 11 Pro Max': return StockCollections.IPhone11ProMax;
      case 'Iphone 12/12pro': return StockCollections.IPhone12;
      case 'Iphone 12 Mini': return StockCollections.IPhone12Mini;
      case 'Iphone 12 Pro Max': return StockCollections.IPhone12ProMax;
      case 'IPhone X/XS': return StockCollections.IPhoneXS;
      case 'IPhone XS Max': return StockCollections.IPhoneXSMax;
      case 'IPhone XR': return StockCollections.IPhoneXR;
      case 'Iphone 13': return StockCollections.IPhone13;
      case 'IPhone 13 Pro': return StockCollections.IPhone13Pro;
      case 'Iphone 13 Pro Max': return StockCollections.IPhone13ProMax;
      case 'IPhone 13 Mini': return StockCollections.IPhone13Mini;
      case 'IPhone 7/8/SE2020': return StockCollections.IPhoneSE;
      case 'IPhone 7/8 plus': return StockCollections.IPhone8plus;
      case 'Airpods Pro / Airpods 3er gen': return StockCollections.AirpodsPro;
      case 'Airpods 1era gen / 2da gen': return StockCollections.Airpods1era;
      case 'Cable': return StockCollections.Cable;
      default: return id;
    }
  }
  public getMonthOnFinaceDOC(month: number) {
    switch (month) {
      case 1: return 'finanzas_enero';
      case 2: return 'finanzas_febrero';
      case 3: return 'finanzas_marzo';
      case 4: return 'finanzas_abril';
      case 5: return 'finanzas_mayo';
      case 6: return 'finanzas_junio'; 
      case 7: return 'finanzas_julio';
      case 8: return 'finanzas_agosto';
      case 9: return 'finanzas_setiembre';
      case 10: return 'finanzas_octubre';
      case 11: return 'finanzas_noviembre';
      case 12: return 'finanzas_diciembre';
      default: return month.toString();
      }
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
    return this.getAllSales(this.getMonthOnSalesDOC(this.actualMonth)).pipe(
      take(1),
      map(x => {
        array = x
        array.data.push(dataBack);
        return x;
      }),
      finalize(() => {
        this.afs.collection('ventas').doc(this.getMonthOnSalesDOC(this.actualMonth)).set(array);
        this.hideLoader();
      })
    );
  }

  public getMonthOnSalesDOC(month: number) {
    switch (month) {
      case 1: return 'ventas_enero';
      case 2: return 'ventas_febrero';
      case 3: return 'ventas_marzo';
      case 4: return 'ventas_abril';
      case 5: return 'ventas_mayo';
      case 6: return 'ventas_junio'; 
      case 7: return 'ventas_julio';
      case 8: return 'ventas_agosto';
      case 9: return 'ventas_setiembre';
      case 10: return 'ventas_octubre';
      case 11: return 'ventas_noviembre';
      case 12: return 'ventas_diciembre';
      default: return month.toString()
      }
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
    return this.getAllSales(this.getMonthOnSalesDOC(this.actualMonth)).pipe(
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
      finalize(() => this.afs.collection('ventas').doc(this.getMonthOnSalesDOC(this.actualMonth)).set(array))
    )
  }

  public justDevelopmentFunc(array: any) {
    this.afs.collection('ventas').doc('ventas_marzo').set(array);
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
