import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userEmail: string = '';
  constructor(
    public readonly auth: AngularFireAuth
  ) { }

  /**
   * Metodo para hacer el logeo del usuario
   * @param user - username
   * @param pass - password
   * @returns 
   */
  public login(user: string, pass: string): Observable<any> {
    return from(this.auth.signInWithEmailAndPassword(user, pass))
  }

  /**
   * Metodo para realizar el cierre de sesión
   */
  public closeSession(): Observable<any> {
    return from(this.auth.signOut())
  }
}
