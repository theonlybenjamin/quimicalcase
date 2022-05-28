import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take, map, finalize, concatMap } from 'rxjs/operators';
import { Collections } from '../config/collections';
import { Sale, SaleArray } from '../interfaces/sale';
import { getMonthOnSalesDOC } from '../utils/utils';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  actualMonth: number;

  constructor(
    private readonly afs: AngularFirestore,
    private loaderService: LoaderService
  ) {
    this.actualMonth = new Date().getMonth() + 1;
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
   * Metodo para agregar una venta a las ventas generales
   * @param newSale - venta a agregar
   * @returns 
   */
   public addSaleToAllSales(newSale: Sale): Observable<SaleArray> {
    this.loaderService.showLoader();
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
        this.loaderService.hideLoader();
      })
    );
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
    return this.getAllSales(getMonthOnSalesDOC(this.actualMonth)).pipe(
      take(1),
      concatMap(x => {
        allSales = x;
        const searchObject = this.searchItemToDelete(allSales, sale);
        const indexToDelete = allSales.data.indexOf(searchObject);
        allSales.data.splice(indexToDelete, 1);
        return this.afs.collection(Collections.VENTAS).doc(getMonthOnSalesDOC(this.actualMonth)).set(allSales);
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
}
