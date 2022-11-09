import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentImage'
})
export class PaymentImagePipe implements PipeTransform {

  transform(value: unknown): unknown {
    switch (value) {
      case "yape": {
        return 'assets/icons/yape.png'
      }
      case "plin": {
        return 'assets/icons/plin.png'
      }
      case "bcp": {
        return 'assets/icons/bcp.png'
      }
      case "bbva": {
        return 'assets/icons/bbva.png'
      }
      case "interbank": {
        return 'assets/icons/interbank.png'
      }
      case "scotia": {
        return 'assets/icons/scotia.jpg'
      }
      case "Izipay": {
        return 'assets/icons/scotia.jpg'
      }
      case "credito": {
        return 'assets/icons/credito.png'
      }
      default: {
        return 'assets/icons/instagram.png'
      }
    }
  }

}
