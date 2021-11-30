import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { olvaStatus } from 'src/app/config/olva-track-status.enum';
import { Olva } from 'src/app/config/olva.interface';

@Component({
  selector: 'app-trackid',
  templateUrl: './trackid.component.html',
  styleUrls: ['./trackid.component.scss']
})
export class TrackidComponent {

  public trackId: string | null;
  public status = '';
  public sentDate = '';
  public trackStatus = '';
  public cliente = '';
  public olvaData: Olva = {} as Olva;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.trackId = this.route.snapshot.queryParamMap.get('id');
    this.http.get(`https://reports.olvaexpress.pe/webservice/rest/getTrackingInformation?tracking=${this.trackId}&emision=21&apikey=a82e5d192fae9bbfee43a964024498e87dfecb884b67c7e95865a3bb07b607dd&details=1`)
    .pipe(
      map((x: any) => x.data)
    )
    .subscribe((x: Olva) => {
      this.sentDate = x.general.fecha_envio;
      this.olvaData = x
      this.cliente = x.general.consignado;
      if(this.cliente.endsWith('-')){
        this.cliente = this.cliente.substring(0, this.cliente.length - 1);
      }
      this.trackStatus = x.general.nombre_estado_tracking;
      this.status = x.details[0].estado_tracking;
    })  
  }

  public progressBarStatus(step: number) {
    switch (this.status){
      case olvaStatus.REGISTERED: {
        if (step === 1){
          return true;
        }
        break;
      };
      case olvaStatus.ONROUTE: {
        if (step === 1 || step === 2){
          return true;
        }
        break;
      };
      case olvaStatus.DELIVERED: {
        if (step && (this.status === this.trackStatus || this.status === olvaStatus.DELIVERED)){
          return true;
        }
        break;
      }
    }
    return false;
  }
}
