import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrackidComponent } from './components/trackid/trackid.component';
import { HttpClientModule } from '@angular/common/http';
import { UrlMakerComponent } from './components/url-maker/url-maker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailTableComponent } from './components/detail-table/detail-table.component';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HomeComponent } from './views/home/home.component';
import { StockComponent } from './views/stock/stock.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { NewSaleComponent } from './views/new-sale/new-sale.component';
import { SendPendingComponent } from './views/send-pending/send-pending.component';
import { SendPendingItemComponent } from './components/send-pending-item/send-pending-item.component';
import { LoginComponent } from './views/login/login.component';
import { AddProductComponent } from './views/add-product/add-product.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ListSaleComponent } from './views/list-sale/list-sale.component';
import { FinancesComponent } from './views/finances/finances.component';
import { LoaderComponent } from './components/loader/loader.component';
import { TiendaComponent } from './views/tienda/tienda.component';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { UploadImageComponent } from './views/upload-image/upload-image.component';
import { NoWhiteSpacesDirective } from './directives/no-white-spaces.directive';
import { HeaderComponent } from './components/header/header.component';
import { ProductoComponent } from './views/producto/producto.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { LowercaseDirective } from './directives/lowercase.directive';
import { LandingComponent } from './views/landing/landing.component';
import { CatalogComponent } from './views/catalog/catalog.component';
import { CatalogCardComponent } from './components/catalog-card/catalog-card.component';
@NgModule({
  declarations: [
    AppComponent,
    TrackidComponent,
    UrlMakerComponent,
    DetailTableComponent,
    HomeComponent,
    StockComponent,
    NewSaleComponent,
    SendPendingComponent,
    SendPendingItemComponent,
    LoginComponent,
    AddProductComponent,
    ListSaleComponent,
    FinancesComponent,
    LoaderComponent,
    TiendaComponent,
    UploadImageComponent,
    NoWhiteSpacesDirective,
    HeaderComponent,
    ProductoComponent,
    ProductCardComponent,
    LowercaseDirective,
    LandingComponent,
    CatalogComponent,
    CatalogCardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    NgbModalModule,
    AngularFireStorageModule
  ],
  providers: [
    AngularFirestore,
    {
      provide: LocationStrategy, useClass: PathLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
