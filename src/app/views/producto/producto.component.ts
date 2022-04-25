import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) {
    this.route.snapshot.queryParamMap.get('id');
    console.log(this.route.snapshot.queryParamMap.get('id'))
  }

  ngOnInit(): void {
  }

}
