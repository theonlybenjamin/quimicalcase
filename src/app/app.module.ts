import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { AngularFireStorageModule } from '@angular/fire/storage';
import { UploadImageComponent } from './views/upload-image/upload-image.component';
import { NoWhiteSpacesDirective } from './directives/no-white-spaces.directive';

import { LowercaseDirective } from './directives/lowercase.directive';
import { PaymentImagePipe } from './pipes/payment-image.pipe';
import { PendingSendCardComponent } from './components/pending-send-card/pending-send-card.component';
@NgModule({
  declarations: [
    AppComponent,
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
    UploadImageComponent,
    NoWhiteSpacesDirective,
    LowercaseDirective,
    PaymentImagePipe,
    PendingSendCardComponent
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
