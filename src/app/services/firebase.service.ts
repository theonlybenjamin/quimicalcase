import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, map, take } from 'rxjs/operators';
import { StockCollections } from '../enums/stock-collections.enum';
import { SendPending, SendPendingArray } from '../interfaces/send-pending';
import { IPhone, Stock } from '../interfaces/stock';
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
      precio: 'error'
    }]
  };
  public mock2: SendPendingArray = {} as SendPendingArray;
  public isLogged = false;
  constructor(
    private readonly afs: AngularFirestore,
    private readonly auth: AngularFireAuth
  ) {

  }

  // public isUserLogged() {
  //   sessionStorage.
  // }
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
      case StockCollections.Mica: return 'Mica';
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
      case 'Mica': return StockCollections.Mica;
      default: return '';
    }
  }

  public setFieldsStockCollection(document: string, data: Stock) {
    const obj: Stock = {
      data: [
      // {
      //   producto: 'Mica',
      //   precio: '1.5',
      //   cant: 1
      // },
      {
        producto: 'Protector de camara',
        precio: '5',
        cant: 3
      },
      // {
      //   producto: 'Protector de lente celeste',
      //   precio: '12',
      //   cant: 1
      // },
      {
        producto: 'Protector de lente plateado',
        precio: '12',
        cant: 1
      },
      {
        producto: 'Protector de lente rosa',
        precio: '12',
        cant: 1
      },
      {
        producto: 'Protector de lente varios',
        precio: '12',
        cant: 1
      },
      // {
      //   producto: 'Protector de lente negro',
      //   precio: '12',
      //   cant: 1
      // },
      {
        producto: 'Clear case',
        precio: '9',
        cant: 1
      },
      {
        producto: '8bits',
        precio: '8.5',
        cant: 1
      },
      // {
      //   producto: 'Bad bunny',
      //   precio: '14',
      //   cant: 1
      // },
      // {
      //   producto: 'Barbie',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Brillo celeste',
      //   precio: '15',
      //   cant: 1
      // },
      // {
      //   producto: 'Brillo rosa',
      //   precio: '15',
      //   cant: 1
      // },
      // {
      //   producto: 'Barbie',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'BTS',
      //   precio: '16',
      //   cant: 1
      // },
      {
        producto: 'Camuflado',
        precio: '16',
        cant: 2
      },
      // {
      //   producto: 'Capitan',
      //   precio: '17',
      //   cant: 1
      // },
      // {
      //   producto: 'Caritas',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Casetify',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Chanel',
      //   precio: '16',
      //   cant: 1
      // },
      {
        producto: 'Coca cola',
        precio: '16',
        cant: 1
      },
      // {
      //   producto: 'Cokita',
      //   precio: '17',
      //   cant: 2
      // },
      // {
      //   producto: 'Corazones espejo',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Comic marvel',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Colours',
      //   precio: '14',
      //   cant: 1
      // },
      // {
      //   producto: 'Cow blanco y negro',
      //   precio: '12',
      //   cant: 1
      // },
      {
        producto: 'Cow transparente',
        precio: '16',
        cant: 1
      },
      // {
      //   producto: 'San antonio',
      //   precio: '15',
      //   cant: 1
      // },
      // {
      //   producto: 'Lakers',
      //   precio: '15',
      //   cant: 1
      // },
      // {
      //   producto: 'Timberwolves',
      //   precio: '15',
      //   cant: 1
      // },
      // {
      //   producto: 'Dextrose',
      //   precio: '16',
      //   cant: 1
      // },
      {
        producto: 'Diamante rosado',
        precio: '14',
        cant: 1
      },
      {
        producto: 'Diamante blanco',
        precio: '14',
        cant: 1
      },
      {
        producto: 'Dragon',
        precio: '16',
        cant: 2
      },
      // {
      //   producto: 'Dreams',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Estrellas',
      //   precio: '15',
      //   cant: 1
      // },
      // {
      //   producto: 'Fairy',
      //   precio: '20',
      //   cant: 1
      // },
      {
        producto: 'Flores blancas',
        precio: '15',
        cant: 1
      },
      // {
      //   producto: 'Flores blancas sonix',
      //   precio: '15',
      //   cant: 1
      // },
      {
        producto: 'Fragile',
        precio: '16',
        cant: 2
      },
      // {
      //   producto: 'Fragile negro',
      //   precio: '8.5',
      //   cant: 1
      // },
      // {
      //   producto: 'Girls',
      //   precio: '16',
      //   cant: 1
      // },
      {
        producto: 'Harry potter',
        precio: '15',
        cant: 1
      },
      // {
      //   producto: 'Hello kitty',
      //   precio: '15',
      //   cant: 1
      // },
      // {
      //   producto: 'Iron man',
      //   precio: '17',
      //   cant: 1
      // },
      // {
      //   producto: 'Ticket las vegas',
      //   precio: '12',
      //   cant: 1
      // },
      // {
      //   producto: 'Ticket las london',
      //   precio: '12',
      //   cant: 1
      // },
      // {
      //   producto: 'Looney',
      //   precio: '17',
      //   cant: 1
      // },
      // {
      //   producto: 'Ticket los angeles',
      //   precio: '12',
      //   cant: 1
      // },
      // {
      //   producto: 'Mario',
      //   precio: '14',
      //   cant: 1
      // },
      // {
      //   producto: 'Mariposa morada',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Mariposa rosa',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Margaritas',
      //   precio: '14',
      //   cant: 1
      // },
      {
        producto: 'Mariposa azul',
        precio: '16',
        cant: 1
      },
      {
        producto: 'Mariposa colores',
        precio: '8,5',
        cant: 1
      },
      // {
      //   producto: 'Marmol blanco',
      //   precio: '15',
      //   cant: 1
      // },
      // {
      //   producto: 'Marmol clear morado',
      //   precio: '12',
      //   cant: 1
      // },
      // {
      //   producto: 'Marmol clear azul',
      //   precio: '12',
      //   cant: 1
      // },
      // {
      //   producto: 'Marmol clear rosa',
      //   precio: '12',
      //   cant: 1
      // },
      // {
      //   producto: 'Marmol clear verde',
      //   precio: '12',
      //   cant: 1
      // },
      // {
      //   producto: 'Marmol negro',
      //   precio: '15',
      //   cant: 1
      // },
      // {
      //   producto: 'Marmol rosa',
      //   precio: '15',
      //   cant: 1
      // },
      {
        producto: 'Marmol varios',
        precio: '15',
        cant: 1
      },
      // {
      //   producto: 'Marmol morado',
      //   precio: '14',
      //   cant: 1
      // },
      {
        producto: 'Marvel',
        precio: '16',
        cant: 1
      },
      // {
      //   producto: 'Marvel negro',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Miami',
      //   precio: '12',
      //   cant: 1
      // },
      // {
      //   producto: 'Mickey',
      //   precio: '17',
      //   cant: 1
      // },
      {
        producto: 'Micky scribble',
        precio: '17',
        cant: 1
      },
      // {
      //   producto: 'Minnie azul',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Moon blanco',
      //   precio: '10',
      //   cant: 2
      // },
      // {
      //   producto: 'Moon negro',
      //   precio: '10',
      //   cant: 1
      // },
      // {
      //   producto: 'Mulan',
      //   precio: '17',
      //   cant: 1
      // },
      // {
      //   producto: 'Nasa',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Ticket new york',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'New york rosa',
      //   precio: '16',
      //   cant: 1
      // },
      {
        producto: 'Off white',
        precio: '16',
        cant: 1
      },
      // {
      //   producto: 'Paris',
      //   precio: '12',
      //   cant: 1
      // },
      {
        producto: 'Patas',
        precio: '16',
        cant: 1
      },
      // {
      //   producto: 'Pokemon',
      //   precio: '17',
      //   cant: 1
      // },
      // {
      //   producto: 'Primavera amarilla',
      //   precio: '14',
      //   cant: 1
      // },
      {
        producto: 'Primavera rosa',
        precio: '14',
        cant: 1
      },
      {
        producto: 'Princesas',
        precio: '17',
        cant: 1
      },
      // {
      //   producto: 'Print negro',
      //   precio: '14',
      //   cant: 1
      // },
      {
        producto: 'Print rosa',
        precio: '10',
        cant: 3
      },
      // {
      //   producto: 'Print transparente',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Rosado con marmol',
      //   precio: '14',
      //   cant: 1
      // },
      {
        producto: 'Rosas',
        precio: '16',
        cant: 1
      },
      // {
      //   producto: 'Sirenita',
      //   precio: '17',
      //   cant: 1
      // },
      {
        producto: 'Smile amarillo',
        precio: '16',
        cant: 2
      },
      // {
      //   producto: 'Smile verde',
      //   precio: '8,5',
      //   cant: 1
      // },
      // {
      //   producto: 'Flores',
      //   precio: '16',
      //   cant: 1
      // },
      {
        producto: 'Print',
        precio: '16',
        cant: 1
      },
      // {
      //   producto: 'Perrito',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Amor y paz',
      //   precio: '9',
      //   cant: 1
      // },
      // {
      //   producto: 'marmol geometria',
      //   precio: '12',
      //   cant: 1
      // },
      // {
      //   producto: 'One piece',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Space jam',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Spiderman',
      //   precio: '17',
      //   cant: 1
      // },
      {
        producto: 'Starbucks',
        precio: '16',
        cant: 2
      },
      // {
      //   producto: 'Thor',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Tune squad',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Versace',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Wanted',
      //   precio: '16',
      //   cant: 1
      // },
      // {
      //   producto: 'Yoda',
      //   precio: '16',
      //   cant: 1
      // }
    ]};
    // this.stockCollection = this.afs.collection('stock').doc(StockCollections.IPhone13ProMax).set(obj);
    this.stockCollection = this.afs.collection('stock').doc(document).set(data);
    console.log(this.stockCollection);
  }

  public setSendPendingColecction(dataBack: SendPending) {
    var array: SendPendingArray = {
      data: []
    };
    this.getSendPending().pipe(
      take(1),
      finalize(() => this.afs.collection('ventas').doc('pendientes_envio').set(array))
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
