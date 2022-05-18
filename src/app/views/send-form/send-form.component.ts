import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize } from 'rxjs/operators';
import { EnviosDocService } from 'src/app/services/envios-doc.service';

@Component({
  selector: 'app-send-form',
  templateUrl: './send-form.component.html',
  styleUrls: ['./send-form.component.scss']
})
export class SendFormComponent implements OnInit {
  public userForm: FormGroup;
  @ViewChild('sucessModal') sucessModal: ElementRef | undefined;
  @ViewChild('errorModal') errorModal: ElementRef | undefined;
  constructor(
    private enviosService: EnviosDocService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.userForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      documentNumber: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      fullname: new FormControl(null, Validators.required),
      courier: new FormControl(null, Validators.required),
      district: new FormControl(null),
      address: new FormControl(null),
      phone: new FormControl(null),
      reference: new FormControl(null),
      agency: new FormControl(null)
    })
  }

  get courier() {
    return this.userForm.get('courier')?.value
  }
  get isOlvaCourier(){
    return (this.userForm.get('courier')?.value as string)?.includes('olva');
  }

  formControlError(name: string) {
    return this.userForm.get(name)?.errors && this.userForm.get(name)?.pristine === false
  }

  ngOnInit(): void {
    console.log(this.userForm.get('documentNumber'))
  }

  selectCourier() {
    switch (this.courier) {
      case 'olva-agencia': {
        console.log('agencia')
        this.userForm.get('phone')?.setValidators(Validators.required);
        this.userForm.get('agency')?.setValidators(Validators.required);

        this.userForm.get('reference')?.setValidators(null);
        this.userForm.get('district')?.setValidators(null);
        this.userForm.get('address')?.setValidators(null);

        this.userForm.get('phone')?.updateValueAndValidity();
        this.userForm.get('agency')?.updateValueAndValidity();
        this.userForm.get('reference')?.updateValueAndValidity();
        this.userForm.get('district')?.updateValueAndValidity();
        this.userForm.get('address')?.updateValueAndValidity();
        break;
      };
      case 'olva-domicilio': {
        this.userForm.get('phone')?.setValidators(Validators.required);
        this.userForm.get('reference')?.setValidators(Validators.required);
        this.userForm.get('district')?.setValidators(Validators.required);
        this.userForm.get('address')?.setValidators(Validators.required);

        this.userForm.get('agency')?.setValidators(null);

        this.userForm.get('phone')?.updateValueAndValidity();
        this.userForm.get('agency')?.updateValueAndValidity();
        this.userForm.get('reference')?.updateValueAndValidity();
        this.userForm.get('district')?.updateValueAndValidity();
        this.userForm.get('address')?.updateValueAndValidity();
        break;
      };
      case 'shalom': {
        this.userForm.get('agency')?.setValidators(Validators.required);

        this.userForm.get('phone')?.setValidators(null);
        this.userForm.get('reference')?.setValidators(null);
        this.userForm.get('district')?.setValidators(null);
        this.userForm.get('address')?.setValidators(null);

        this.userForm.get('phone')?.updateValueAndValidity();
        this.userForm.get('agency')?.updateValueAndValidity();
        this.userForm.get('reference')?.updateValueAndValidity();
        this.userForm.get('district')?.updateValueAndValidity();
        this.userForm.get('address')?.updateValueAndValidity();
        break;
      }
      default:
        break;
    }
  }

  sendForm() {
    if (this.userForm.valid) {
      this.enviosService.addOrderToPendingList(this.userForm.value).pipe(
        catchError(error => {
          this.modalService?.open(this.errorModal, {centered: true})
          return error;
        }),
        finalize(() => this.modalService?.open(this.sucessModal, {centered: true}))
      ).subscribe();
    }
  }

  goToCatalog() {
    this.router.navigate(['tienda/catalogo']);
    this.modalService.dismissAll();
  }
}
