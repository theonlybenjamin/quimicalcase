import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.scss']
})
export class TiendaComponent implements OnInit {
  @ViewChild('sideBar') sideBar: ElementRef = {} as ElementRef;
  @ViewChild('iphone') iphone: ElementRef = {} as ElementRef;
  @ViewChild('micas') micas: ElementRef = {} as ElementRef;

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
    public router: Router,
    private sharedData: SharedDataService
  ) {
    this.sharedData.subscribe(x => {
      this.closeSideBar()
      document.getElementById(x)?.classList.add('show');
    })
  }

  ngOnInit(): void {
  }

  public showCatalog(id: string) {
    this.router.navigate(['tienda', 'producto'], {queryParams: {id:id}});
  }

  public closeSideBar(){
    this.sideBar.nativeElement.classList.toggle('hide');
    this.iphone.nativeElement.classList.remove('show');
  }
}
