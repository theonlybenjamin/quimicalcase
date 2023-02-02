import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userEmail: string = '';
  constructor(
    public readonly auth: AngularFireAuth
  ) { }

  public login(user: string, pass: string): Promise<any> {
    return this.auth.signInWithEmailAndPassword(user, pass)
  }

  public closeSession(): Promise<any> {
    return this.auth.signOut();
  }
}
