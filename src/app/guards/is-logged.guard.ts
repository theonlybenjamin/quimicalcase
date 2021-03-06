import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Routes } from '../config/routes.enum';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuard implements CanActivate {
  constructor(private fireAuthService: AuthService, private router: Router){}
  canActivate(): boolean | Observable<boolean> {
      return this.fireAuthService.auth.authState.pipe(
        map(x => {
          const value = x;
          if (value && value.email) {
            this.fireAuthService.userEmail = value?.email;
            this.router.navigate([Routes.HOME]);
            return false;
          } else {
            return true;
          }
        })
      );
  }
  
}
