import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrackidComponent } from './components/trackid/trackid.component';
import { HttpClientModule } from '@angular/common/http';
import { UrlMakerComponent } from './components/url-maker/url-maker.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailTableComponent } from './components/detail-table/detail-table.component';

@NgModule({
  declarations: [
    AppComponent,
    TrackidComponent,
    UrlMakerComponent,
    DetailTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
