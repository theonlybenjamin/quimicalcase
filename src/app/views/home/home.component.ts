import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Routes } from 'src/app/config/routes.enum';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public isMenuOpen = false;
  public showAdminOptions = false;
  constructor(
    private firebaseService: AuthService,
    private router: Router
  ) {
    if (this.firebaseService.userEmail.startsWith('benja.') || this.firebaseService.userEmail.startsWith('andreal')) {
      this.showAdminOptions = true;
    }
  }

  ngOnInit(): void {
  }

  public changeMenuStatus() {
    this.isMenuOpen = !this.isMenuOpen;
    document.getElementById('nav-bar')?.classList.toggle('show');
    document.getElementById('header-toggle')?.classList.toggle('bx-x');
    document.getElementById('body-pd')?.classList.toggle('body-expanded');
    document.getElementById('header')?.classList.toggle('body-expanded');
  }

  public changeMenuIcon(): string {
    if (this.isMenuOpen) {
      return 'bx bx-x';
    } else {
      return 'bx bx-menu';
    }
  }

  async closeSession() {
    await this.firebaseService.closeSession().catch(() => {
      this.router.navigate([Routes.LOGIN])
    }
    ).then(() => this.router.navigate([Routes.LOGIN]));
  }
}
