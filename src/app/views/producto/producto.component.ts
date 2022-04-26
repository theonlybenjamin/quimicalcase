import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/interfaces/stock';
import { FirebaseService } from 'src/app/services/firebase.service';
import { idByIphoneName } from 'src/app/utils/utils';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit, OnDestroy {

  public iphoneCode: string = '';
  public justStock: Array<Product> = []
  private subscriptions = new Subscription();
  constructor(
    private route: ActivatedRoute,
    private fireService: FirebaseService
  ) {
    const ga = this.route.snapshot.queryParamMap.get('id');
    this.iphoneCode = idByIphoneName(ga ? ga.replace("-", " ") : 'error');
    this.subscriptions.add(this.fireService.getStockSpecificDocumentAlone(this.iphoneCode).subscribe(x => {
      this.justStock = x.data;
    }));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
