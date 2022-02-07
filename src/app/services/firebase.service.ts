import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, Subscription, throwError } from 'rxjs';
import { catchError, finalize, map, take } from 'rxjs/operators';
import { StockCollections } from '../enums/stock-collections.enum';
import { SendPending, SendPendingArray } from '../interfaces/send-pending';
import { IPhone, Stock, Stock2, StockProduct } from '../interfaces/stock';
import { AngularFireAuth } from '@angular/fire/auth';
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
  constructor(
    private readonly afs: AngularFirestore,
    private readonly auth: AngularFireAuth
  ) {

  }

  public async login(user: string, pass: string) {
    try {
      const result = await this.auth.signInWithEmailAndPassword(user, pass);
      this.isLogged = true;
      return 'ok';
    } catch (error) {
      return 'error';
    }
  }

  public async closeSession() {
    this.isLogged = false;
    await this.auth.signOut();
  }

  public getSendPending(): Observable<SendPendingArray> {
    return this.afs.collection<SendPendingArray>('ventas').doc('pendientes_envio').valueChanges().pipe(
      map(x => {
        if (x) {
          return x;
        } else {
          return this.mock2;
        }
      })
    );
  }

  public getAllSales(): Observable<SendPendingArray> {
    return this.afs.collection<SendPendingArray>('ventas').doc('total_ventas').valueChanges().pipe(
      map(x => {
        if (x) {
          return x;
        } else {
          return this.mock2;
        }
      })
    );
  }

  public getStockSpecificDocument(collection: string): Observable<Stock> {
    return this.afs.collection<Stock>('stock').doc(collection).valueChanges({ idField: 'docId' }).pipe(
      map(x => {
        if (x) {
          return x;
        } else {
          return this.mock;
        }
      })
    );
  }

  public getStockSpecificDocumentAlone(collection: string): Observable<Stock> {
    return this.afs.collection<Stock>('stock').doc(collection).valueChanges() as Observable<Stock>;
  }

  public setNewProduct(document: string, array: Stock): Observable<boolean>{
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
      default: return '';
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
      default: return '';
    }
  }

  public setFieldsStockCollection(document: string, data: Stock) {
    this.stockCollection = this.afs.collection('stock').doc(document).set(data);
  }

  public setSendPendingColecction(dataBack: SendPending) {
    var array: SendPendingArray = {
      data: []
    };
    this.getSendPending().pipe(
      take(1),
      finalize(() => {
        this.afs.collection('ventas').doc('pendientes_envio').set(array);
      })
    ).subscribe(x => {
      array = x
      array.data.push(dataBack);

    });
  }

  public setAllSalesCollecction(dataBack: SendPending) {
    var array: SendPendingArray = {
      data: []
    };
    this.getAllSales().pipe(
      take(1),
      finalize(() => {
        this.afs.collection('ventas').doc('total_ventas').set(array);
      })
    ).subscribe(x => {
      array = x
      array.data.push(dataBack);

    });
  }

  public deleteItemPendingCollection(order: SendPending) {
    var array: SendPendingArray = {
      data: []
    };
    this.getSendPending().pipe(
      take(1),
      finalize(() => this.afs.collection('ventas').doc('pendientes_envio').set(array))
    ).subscribe(x => {
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
    });
  }
}
