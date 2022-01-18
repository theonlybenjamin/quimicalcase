import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackidComponent } from './components/trackid/trackid.component';
import { UrlMakerComponent } from './components/url-maker/url-maker.component';
import { IsLoggedGuard } from './guards/is-logged.guard';
import { UserLoggedGuard } from './guards/user-logged.guard';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { NewSaleComponent } from './views/new-sale/new-sale.component';
import { SendPendingComponent } from './views/send-pending/send-pending.component';
import { StockComponent } from './views/stock/stock.component';

const routes: Routes = [{
  path: 'tracking',
  component: TrackidComponent
},{
  path: 'login',
  component: LoginComponent,
  canActivate: [IsLoggedGuard]
}, {
  path: 'home',
  component: HomeComponent,
  canActivate: [UserLoggedGuard],
  children: [{
    path: 'nueva-venta',
    component: NewSaleComponent
  },{
    path: 'pendiente-envio',
    component: SendPendingComponent
  }, {
    path: 'stock',
    component: StockComponent
  },{
    path: '',
    pathMatch: 'full',
    redirectTo: 'nueva-venta'
  }]
}, {
  path: '',
  pathMatch: 'full',
  redirectTo: 'tracking'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
