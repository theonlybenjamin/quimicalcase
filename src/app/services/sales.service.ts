import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { isEqual } from 'lodash';
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
        console.log(allSales);
        return x;
      }),
      finalize(() => {
        this.afs.collection(Collections.VENTAS).doc(getMonthOnSalesDOC(this.actualMonth)).set(allSales);
        this.loaderService.hideLoader();
      })
    );
  }

  public deleteSale(saleToDelete: Sale, month?: number) {

    return this.getAllSales(getMonthOnSalesDOC(month && month !== 0 ? month : this.actualMonth)).pipe(
      take(1),
      concatMap(allSales => {
        const index = allSales.data.findIndex(sale => isEqual(sale, saleToDelete));
        allSales.data.splice(index, 1);

        return this.afs.collection(Collections.VENTAS)
          .doc(getMonthOnSalesDOC(month && month !== 0 ? month : this.actualMonth))
          .set(allSales);
      })
    )
  }

  public addLogisticExpense(oldSale: Sale, logisticCost: number, month?: number) {
    const monthToEdit = month && month !== 0 ? month : this.actualMonth;

    return this.getAllSales(getMonthOnSalesDOC(monthToEdit)).pipe(
      take(1),
      concatMap(allSales => {
        const index = allSales.data.findIndex(sale => isEqual(sale, oldSale));
        allSales.data[index].logisticCost = logisticCost;

        return this.afs.collection(Collections.VENTAS)
          .doc(getMonthOnSalesDOC(monthToEdit))
          .set(allSales);
      })
    )
  }
}
