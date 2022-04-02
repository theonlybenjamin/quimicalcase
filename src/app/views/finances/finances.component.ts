import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FinancesDoc, FinancesGastos, FinancesIngresos } from 'src/app/interfaces/finances';
import { FirebaseService } from 'src/app/services/firebase.service';
import { getMonthOnFinaceDOC } from 'src/app/utils/utils';

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
  public totalExpenses: number = 0;
  public salary = 1200;
  public publicity = 200;
  public emanuel = 177;
  public gastosImprevistos = 0;
  public reinversion = 0;
  public ingresoBruto = 0;
  constructor(
    public fireService: FirebaseService
  ) {
    this.totalExpenses  = this.salary + this.publicity + this.emanuel;
    this.fireService.showLoader();
    this.actualMonth = (new Date().getMonth() + 1);
    this.getSends(getMonthOnFinaceDOC(this.actualMonth));
    this.expenseForm = new FormGroup({
      expense_detail: new FormControl(null, Validators.required),
      expense_amount: new FormControl(null, Validators.required),
    });
  }

  public getSends(doc: string) {
    this.fireService.getFinances(doc).subscribe(x => {
      this.finances = x;
      this.profit = x.ingresos;
      this.ingresoBruto = Number(this.profit.monto.toFixed(1));
      for (let i = 0; i < x.gastos.length; i++) {
          this.expenses[i] = x.gastos[i];
          this.totalExpenses += x.gastos[i].monto ? Number(x.gastos[i].monto.toFixed(1)) : x.gastos[i].monto;
        }
        this.totalExpenses = Number(this.totalExpenses.toFixed(1));
        this.gastosImprevistos = Number((this.totalExpenses - this.salary - this.emanuel - this.publicity).toFixed(1));
        this.reinversion = Number((this.profit.monto - this.totalExpenses).toFixed(1))
      this.fireService.hideLoader();
    });
  }

  public changeMonth($event: string) {
    this.getSends(getMonthOnFinaceDOC(Number($event)));
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
