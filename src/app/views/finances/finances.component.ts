import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { pipe } from 'rxjs';
import { concatMap, finalize, map } from 'rxjs/operators';
import { FinancesDoc, FinancesGastos } from 'src/app/interfaces/finances';
import { AuthService } from 'src/app/services/auth.service';
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
  public sellsCount: number = 0;
  public finances: FinancesDoc = {} as FinancesDoc;
  public gastosIngresados = 0;
  public ingresoBruto = 0;
  public moneyOnCard: number = 0;
  public expenseType: string = '';

  public totalBuy = 0;
  public totalAndrea = 0;
  public totalOlva = 0;
  public totalEmanuel = 0;
  public totalOtro = 0;
  public totalPublicidad = 0;

  constructor(
    public fireService: FinancesService,
    private loaderService: LoaderService,
    private salesService: SalesService,
    public authService: AuthService,
    private router: Router
  ) {
    this.loaderService.showLoader();
    this.actualMonth = (new Date().getMonth() + 1);
    this.getExpenses(this.actualMonth).subscribe();
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
        this.sellsCount = x.data.length;
        this.ingresoBruto = Number(total.toFixed(2));
        this.moneyOnCard = Number((this.ingresoBruto - this.gastosIngresados).toFixed(2));
        this.loaderService.hideLoader();
      })
    )
  }

  public getExpenses(month: number) {
    return this.fireService.getFinances(getMonthOnFinaceDOC(month)).pipe(
      concatMap(x => {
        this.finances = x;
        this.expenses = x.gastos;
        x.gastos.map(z => {
          if(z.detalle.startsWith('compra:')){
            this.totalBuy += z.monto;
          } else if (z.detalle.startsWith('andrea:')) {
            this.totalAndrea += z.monto;
          } else if (z.detalle.startsWith('emanuel:')) {
            this.totalEmanuel += z.monto;
          } else if (z.detalle.startsWith('olva:')) {
            this.totalOlva += z.monto;
          } else if (z.detalle.startsWith('publicidad:')) {
            this.totalPublicidad += z.monto;
          } else if (z.detalle.startsWith('otro:')) {
            this.totalOtro += z.monto;
          } else {
            this.totalOtro += z.monto;
          }
          this.gastosIngresados += z.monto;
        });
        this.totalBuy = Number(this.totalBuy.toFixed(2));
        this.totalAndrea = Number(this.totalAndrea.toFixed(2));
        this.totalOlva = Number(this.totalOlva.toFixed(2));
        this.totalEmanuel = Number(this.totalEmanuel.toFixed(2));
        this.totalOtro = Number(this.totalOtro.toFixed(2));
        this.totalPublicidad = Number(this.totalPublicidad.toFixed(2));
        this.gastosIngresados = Number(this.gastosIngresados.toFixed(2));
        this.loaderService.hideLoader();
        return this.getTotalSales(month);
      })
    );
  }

  public changeMonth($event: string) {
    this.expenses = [];
    this.gastosIngresados = 0;
    this.getExpenses(Number($event)).subscribe();
  }

  /**
   * Metodo para ingresar un gasto a la base de datos
   */
  public addExpense() {
    if (this.expenseForm.valid) {
      var expense: FinancesGastos = {
        detalle: this.expenseType + ': ' + this.expenseForm.get('expense_detail')?.value,
        monto: this.expenseForm.get('expense_amount')?.value,
        fecha: new Date().getDate() + '/' + this.actualMonth
      };
      this.finances.gastos.push(expense);
      this.fireService.setNewExpense(getMonthOnFinaceDOC(this.actualMonth), this.finances).pipe(
        finalize(() => {
          location.reload();
        })
      ).subscribe();
    }
  }
}
