import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize, map, take } from 'rxjs/operators';
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
    this.fireService.showLoader();
    const ga = this.route.snapshot.queryParamMap.get('id');
    this.iphoneCode = idByIphoneName(ga ? ga.replace("-", " ") : 'error');
    this.subscriptions.add(this.fireService.getStockSpecificDocumentAlone(this.iphoneCode).pipe(
      take(1),
      map(x => this.justStock = x.data),
      finalize(() => this.fireService.hideLoader())
    ).subscribe());
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
