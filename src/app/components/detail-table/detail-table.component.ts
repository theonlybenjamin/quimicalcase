import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { OlvaDetails } from 'src/app/config/olva.interface';

@Component({
  selector: 'app-detail-table',
  templateUrl: './detail-table.component.html',
  styleUrls: ['./detail-table.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class DetailTableComponent implements OnInit {
  
  @Input() details: OlvaDetails[] = {} as OlvaDetails[];
  constructor() { }

  ngOnInit(): void {
  }

}
