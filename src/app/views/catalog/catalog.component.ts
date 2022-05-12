import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogProduct } from 'src/app/interfaces/catalog.interface';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  products: Array<CatalogProduct> = [
    {
      name: 'IPhone',
      url: 'url(https://firebasestorage.googleapis.com/v0/b/quimicalcase-47f4e.appspot.com/o/iphone%2Fsmile-amarillo.jpg?alt=media&token=d5368aea-b4c9-407b-aee0-169348d9cfb4)',
      title: 'Ver cases para IPhone',
      subtitle: '@quimicalcase',
      func: this.sendType.bind(this, 'iphone')
    },
    {
      name: 'Watch',
      url: 'url(https://firebasestorage.googleapis.com/v0/b/quimicalcase-47f4e.appspot.com/o/iphone%2Fsmile-amarillo.jpg?alt=media&token=d5368aea-b4c9-407b-aee0-169348d9cfb4)',
      title: 'Ver correas para Apple Watch',
      subtitle: '@quimicalcase',
      func: this.sendType.bind(this, 'watch')
    },
    {
      name: 'Accesorios',
      url: 'url(https://firebasestorage.googleapis.com/v0/b/quimicalcase-47f4e.appspot.com/o/cable%2Fmickey-guante.jpg?alt=media&token=b7f646a7-adc1-4c47-a2ee-79fe44e82e75)',
      title: 'Ver accesorios',
      subtitle: '@quimicalcase',
      func: this.routeTo.bind(this,'Cable')
    },
    {
      name: 'Protectores de camara',
      url: 'url(https://firebasestorage.googleapis.com/v0/b/quimicalcase-47f4e.appspot.com/o/iphone%2Fsmile-amarillo.jpg?alt=media&token=d5368aea-b4c9-407b-aee0-169348d9cfb4)',
      title: 'Ver protectores de camara',
      subtitle: '@quimicalcase',
      func: this.routeTo.bind(this, 'Camara')
    },
    {
      name: 'Airpods',
      url: 'url(https://firebasestorage.googleapis.com/v0/b/quimicalcase-47f4e.appspot.com/o/airpods%2Fflores-blue.jpg?alt=media&token=7e900a08-e084-4ed5-9df3-18ebb1753e65)',
      title: 'Ver cases para Airpods',
      subtitle: '@quimicalcase',
      func: this.routeTo.bind(this,'Airpods 1era gen / 2da gen')
    },
    {
      name: 'Airpods Pro',
      url: 'url(https://firebasestorage.googleapis.com/v0/b/quimicalcase-47f4e.appspot.com/o/airpodspro%2Fcorazones.jpg?alt=media&token=7a4d688b-9ba7-4d88-8032-610e24713fd3)',
      title: 'Ver cases para Airpods Pro',
      subtitle: '@quimicalcase',
      func: this.routeTo.bind(this,'Airpods Pro')
    }

  ]
  constructor(
    public sharedData: SharedDataService,
    public router: Router
  ) { }

  ngOnInit(): void {
  }

  public sendType(type:string):void {
    console.log(type);
    this.sharedData.next(type);
  }

  public routeTo(type: string):void {
    void this.router.navigate(['tienda', 'producto'], {queryParams: {id: type}})
  }
}
