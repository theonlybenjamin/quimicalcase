import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Routes } from 'src/app/config/routes.enum';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public loginForm: FormGroup;
  public showError: boolean = false;

  constructor(
    private fireService: AuthService,
    private loaderService: LoaderService,
    private router: Router,
  ) {
    this.loginForm = new FormGroup({
      user: new FormControl('', Validators.required),
      pass: new FormControl('', Validators.required)
    });
  }
  async doLogin() {
    this.loaderService.showLoader();
    var user = this.loginForm.get('user')?.value;
    var pass = this.loginForm.get('pass')?.value
    if (user !== null && pass !== null) {
      await this.fireService.login(user, pass).catch(() => {
        this.showError = true;
      }
      ).then(() => {
        this.router.navigate([Routes.HOME]);
        this.loaderService.hideLoader();
      });
    }
  }
}
