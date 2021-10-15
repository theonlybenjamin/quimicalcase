import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackidComponent } from './components/trackid/trackid.component';
import { UrlMakerComponent } from './components/url-maker/url-maker.component';

const routes: Routes = [{
  path: '',
  component: TrackidComponent
}, {
  path: 'url',
  component: UrlMakerComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
