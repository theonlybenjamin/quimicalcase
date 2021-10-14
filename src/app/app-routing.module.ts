import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackidComponent } from './components/trackid/trackid.component';

const routes: Routes = [{
  path: '',
  component: TrackidComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
