import { Component, OnInit } from '@angular/core';
import { FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-send-form',
  templateUrl: './send-form.component.html',
  styleUrls: ['./send-form.component.scss']
})
export class SendFormComponent implements OnInit {
  public userForm: FormGroup;
  constructor() {
    this.userForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      documentNumber: new FormControl(null, Validators.required),
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
  ngOnInit(): void {
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
        break;
      };
      case 'olva-domicilio': {
        this.userForm.get('phone')?.setValidators(Validators.required);
        this.userForm.get('reference')?.setValidators(Validators.required);
        this.userForm.get('district')?.setValidators(Validators.required);
        this.userForm.get('address')?.setValidators(Validators.required);

        this.userForm.get('agency')?.setValidators(null);
        break;
      };
      case 'shalom': {
        this.userForm.get('agency')?.setValidators(Validators.required);

        this.userForm.get('phone')?.setValidators(null);
        this.userForm.get('reference')?.setValidators(null);
        this.userForm.get('district')?.setValidators(null);
        this.userForm.get('address')?.setValidators(null);
        break;
      }
      default:
        break;
    }
  }
  sendForm() {
    console.log(this.userForm)
  }
}
