import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuard implements CanActivate {
  constructor(private fireAuthService: FirebaseService, private router: Router){}
  canActivate(): boolean | Observable<boolean> {
      return this.fireAuthService.auth.authState.pipe(
        map(x => {
          const value = x;
          if (value && value.email) {
            this.router.navigate(['/home']);
            return false;
          } else {
            return true;
          }
        })
      );
  }
  
}
