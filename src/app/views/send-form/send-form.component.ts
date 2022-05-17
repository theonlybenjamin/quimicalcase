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
      district: new FormControl(null, Validators.required),
      address: new FormControl(null),
      phone: new FormControl(null),
      reference: new FormControl(null),
      agency: new FormControl(null)
    })
  }

  ngOnInit(): void {
  }

  ga(){
    console.log(this.userForm.get('courier')?.value)
  }
}
