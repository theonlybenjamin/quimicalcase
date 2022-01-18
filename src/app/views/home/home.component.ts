import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public isMenuOpen = false;
  constructor(private firebaseService: FirebaseService, private router: Router) { }

  ngOnInit(): void {
  }

  public changeMenuStatus() {
    this.isMenuOpen = !this.isMenuOpen;
    document.getElementById('nav-bar')?.classList.toggle('show');
    document.getElementById('header-toggle')?.classList.toggle('bx-x');
    document.getElementById('body-pd')?.classList.toggle('body-expanded');
    document.getElementById('header')?.classList.toggle('body-expanded');
  }

  public changeMenuIcon(): string{
    if (this.isMenuOpen) {
      return 'bx bx-x';
    } else {
      return 'bx bx-menu';
    }
  }

  closeSession() {
    
    this.firebaseService.closeSession().finally(() => this.router.navigate(['/login']));
  }
}
