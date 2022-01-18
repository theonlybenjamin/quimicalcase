import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuard implements CanActivate {
  constructor(private fireAuthService: FirebaseService, private router: Router){}
  canActivate(): boolean {
    if (this.fireAuthService.isLogged || sessionStorage.key(0)?.includes('firebase:authUser')) {
      this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
  
}
