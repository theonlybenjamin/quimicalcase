import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { concatMap, map } from 'rxjs/operators';
import { FinancesDoc, FinancesGastos, FinancesIngresos } from 'src/app/interfaces/finances';
import { FinancesService } from 'src/app/services/finances.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SalesService } from 'src/app/services/sales.service';
import { getMonthOnFinaceDOC, getMonthOnSalesDOC } from 'src/app/utils/utils';

@Component({
  selector: 'app-finances',
  templateUrl: './finances.component.html',
  styleUrls: ['./finances.component.scss']
})
export class FinancesComponent {

  public expenses: Array<FinancesGastos> = [];
  public actualMonth: number;
  @ViewChild('successModal') successModal: ElementRef | undefined;
  public expenseForm: FormGroup;
  public months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public profit: FinancesIngresos = {} as FinancesIngresos;
  public finances: FinancesDoc = {} as FinancesDoc;
  public salary = 1200;
  // costo por ida * veces que ha ido
  public malvinas = 28 * 0;
  // costo por ida * veces que ha ido + extra de mi casa de andrea a mi casa
  public puente = (14 * 13) + 3 + 6;
  public emanuel = this.malvinas + this.puente;
  public gastosIngresados = 0;
  public reinversion = 0;
  public ingresoBruto = 0;
  public prestamo = 300;
  public gastosProgramados = 0;
  public moneyOnCard: number = 0;
  public sobranteMesAnterior = 204.46;
  constructor(
    public fireService: FinancesService,
    private loaderService: LoaderService,
    private salesService: SalesService
  ) {
    this.gastosProgramados  = Number((this.salary + this.emanuel + this.prestamo).toFixed(1));
    this.loaderService.showLoader();
    this.actualMonth = (new Date().getMonth() + 1);
    console.log(this.actualMonth);
    this.getSends(this.actualMonth).subscribe();
    this.expenseForm = new FormGroup({
      expense_detail: new FormControl(null, Validators.required),
      expense_amount: new FormControl(null, Validators.required),
    });
  }

  public getTotalSales(month: number) {
    var total = 0;
    return this.salesService.getAllSales(getMonthOnSalesDOC(month)).pipe(
      map(x => {
        for (let i = 0; i < x.data.length; i++) {
          total += x.data[i].total;
        }
        this.profit.cantidad_ventas = x.data.length;
        this.profit.monto = total;
        this.ingresoBruto = Number(this.profit.monto.toFixed(2));
        this.moneyOnCard = Number((this.ingresoBruto + this.sobranteMesAnterior - this.gastosIngresados).toFixed(2));
        this.loaderService.hideLoader();
      })
    )
  }

  public getSends(month: number) {
    return this.fireService.getFinances(getMonthOnFinaceDOC(month)).pipe(
      concatMap(x => {
        this.finances = x;
        for (let i = 0; i < x.gastos.length; i++) {
            this.expenses[i] = x.gastos[i];
            this.gastosIngresados += x.gastos[i].monto ? Number(x.gastos[i].monto) : x.gastos[i].monto;
          }
          this.gastosIngresados = Number(this.gastosIngresados.toFixed(2));
        this.loaderService.hideLoader();
        return this.getTotalSales(month);
      })
    );
  }

  public changeMonth($event: string) {
    this.expenses = [];
    this.gastosIngresados = 0;
    this.getSends(Number($event)).subscribe();
  }

  /**
   * Metodo para ingresar un gasto a la base de datos
   */
  public addExpense() {
    if (this.expenseForm.valid) {
      var expense: FinancesGastos = {
        detalle: this.expenseForm.get('expense_detail')?.value,
        monto: this.expenseForm.get('expense_amount')?.value,
        fecha: new Date().getDate() + '/' + this.actualMonth
      };
      this.finances.gastos.push(expense);
      this.fireService.setNewExpense(getMonthOnFinaceDOC(this.actualMonth), this.finances).subscribe();
      this.expenseForm.reset();
    }
  }
}
