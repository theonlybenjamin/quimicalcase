import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.scss']
})
export class TiendaComponent implements OnInit {
  public IPhoneProducts = [
    'IPhone 13 Pro Max',
    'IPhone 13 Pro',
    'IPhone 13 Mini',
    'IPhone 13',
    'IPhone 12 Pro Max',
    'IPhone 12/12pro',
    'IPhone 12 Mini',
    'IPhone 11 Pro Max',
    'IPhone 11 Pro',
    'IPhone 11',
    'IPhone XR',
    'IPhone XS Max',
    'IPhone X/XS',
    'IPhone 7/8 plus',
    'IPhone 7/8/SE2020',
  ];
  constructor(
    public router: Router
  ) { }

  ngOnInit(): void {
  }

  public showCatalog(id: string) {
    this.router.navigate(['tienda', 'producto'], {queryParams: {id:id}});
  }
}
