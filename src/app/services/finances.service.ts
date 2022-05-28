import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { Collections } from '../config/collections';
import { FinancesDoc } from '../interfaces/finances';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class FinancesService {

  constructor(
    private readonly afs: AngularFirestore,
    private loaderService: LoaderService
  ) { }


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
    this.loaderService.showLoader();
    return from(this.afs.collection(Collections.FINANZAS).doc(document).set(array)).pipe(
      map(x => true),
      finalize(() => this.loaderService.hideLoader())
    );
  }
}
