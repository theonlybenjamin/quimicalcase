import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrackidComponent } from './components/trackid/trackid.component';
import { HttpClientModule } from '@angular/common/http';
import { UrlMakerComponent } from './components/url-maker/url-maker.component';
import { ReactiveFormsModule } from '@angular/forms';
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
import { PERSISTENCE } from '@angular/fire/auth';

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
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [
    AngularFirestore,
    {
      provide: LocationStrategy, useClass: PathLocationStrategy
    },
    { provide: PERSISTENCE, useValue: 'session' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
