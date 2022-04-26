import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/stock';
import { setDashesToName } from 'src/app/utils/utils';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product: Product = {} as Product;
  @Input() code: string = '';
  constructor() { }

  ngOnInit(): void {
  }

  public getImageURL(name: string, code: string) {
    return setDashesToName(name, code);
  }
}
