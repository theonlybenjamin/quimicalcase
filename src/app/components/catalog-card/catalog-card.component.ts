import { Component, Input, OnInit } from '@angular/core';
import { CatalogProduct } from 'src/app/interfaces/catalog.interface';

@Component({
  selector: 'app-catalog-card',
  templateUrl: './catalog-card.component.html',
  styleUrls: ['./catalog-card.component.scss']
})
export class CatalogCardComponent implements OnInit {

  @Input() product: CatalogProduct= {} as CatalogProduct;
  constructor() { }

  ngOnInit(): void {
  }

}
