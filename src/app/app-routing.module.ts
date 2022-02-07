import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackidComponent } from './components/trackid/trackid.component';
import { UrlMakerComponent } from './components/url-maker/url-maker.component';
import { IsLoggedGuard } from './guards/is-logged.guard';
import { UserLoggedGuard } from './guards/user-logged.guard';
import { AddProductComponent } from './views/add-product/add-product.component';
import { HomeComponent } from './views/home/home.component';
import { ListSaleComponent } from './views/list-sale/list-sale.component';
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
    path: 'ventas',
    component: ListSaleComponent
  },{
    path: 'stock',
    component: StockComponent
  }, {
    path: 'agregar-producto',
    component: AddProductComponent
  },
  {
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
