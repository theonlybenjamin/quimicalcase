import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FinancesDoc, FinancesGastos, FinancesIngresos } from 'src/app/interfaces/finances';
import { FirebaseService } from 'src/app/services/firebase.service';

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
  constructor(
    public fireService: FirebaseService
  ) {
    this.fireService.showLoader();
    this.actualMonth = (new Date().getMonth() + 1);
    this.getSends(this.getMonthOnSalesDOC(this.actualMonth));
    this.expenseForm = new FormGroup({
      expense_detail: new FormControl(null, Validators.required),
      expense_amount: new FormControl(null, Validators.required),
    });
  }

  public getSends(doc: string) {
    this.fireService.getFinances(doc).subscribe(x => {
      this.finances = x;
      this.profit = x.ingresos;
      for (let i = 0; i < x.gastos.length; i++) {
          this.expenses[i] = x.gastos[i];
          this.totalExpenses += x.gastos[i].monto;
        }
      this.fireService.hideLoader();
    });
  }

  public getMonthOnSalesDOC(month: number) {
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

  public changeMonth($event: string) {
    this.getSends(this.getMonthOnSalesDOC(Number($event)));
  }

  /**
   * Metodo para ingresar un gasto a la base de datos
   */
  public addExpense() {
    if (this.expenseForm.valid) {
      var expense: FinancesGastos = {
        detalle: this.expenseForm.get('expense_detail')?.value,
        monto: this.expenseForm.get('expense_amount')?.value,
        fecha: new Date().getDay() + '/' + this.actualMonth
      };
      this.finances.gastos.push(expense);
      this.fireService.setNewExpense(this.getMonthOnSalesDOC(this.actualMonth), this.finances).subscribe();
      this.expenseForm.reset();
    }
  }
}
