import { StockCollections } from "../enums/stock-collections.enum";
import { StorageUrl } from "../enums/storage.enum";

/**
 * Funcion para devolver el nombre comercial del iphone dando su ID
 * @param id - id del doc de iphone
 * @returns nombre comercial de iphone
 */
export function iphoneNameById(id: string) {
    switch(id){
      case StockCollections.IPhone11: return 'IPhone 11';
      case StockCollections.IPhone11Pro: return 'IPhone 11 Pro';
      case StockCollections.IPhone11ProMax: return 'IPhone 11 Pro Max';
      case StockCollections.IPhone12: return 'IPhone 12/12pro';
      case StockCollections.IPhone12Mini: return 'IPhone 12 Mini';
      case StockCollections.IPhone12ProMax: return 'IPhone 12 Pro Max';
      case StockCollections.IPhoneXS: return 'IPhone X/XS';
      case StockCollections.IPhoneXSMax: return 'IPhone XS Max';
      case StockCollections.IPhoneXR: return 'IPhone XR';
      case StockCollections.IPhone13: return 'IPhone 13';
      case StockCollections.IPhone13Pro: return 'IPhone 13 Pro';
      case StockCollections.IPhone13ProMax: return 'IPhone 13 Pro Max';
      case StockCollections.IPhone13Mini: return 'IPhone 13 Mini';
      case StockCollections.IPhoneSE: return 'IPhone 7/8/SE2020';
      case StockCollections.IPhone8plus: return 'IPhone 7/8 plus';
      case StockCollections.AirpodsPro: return 'Airpods Pro / Airpods 3er gen';
      case StockCollections.Airpods1era: return 'Airpods 1era gen / 2da gen';
      case StockCollections.Cable: return 'Cable';
      case StockCollections.Mica: return 'Mica';
      case StockCollections.Camara: return 'Camara';
      case StockCollections.Gift: return 'Regalos';
      default: return id;
    }
}

/**
 * Funcion para devolver el ID del iphone segun su nombre
 * @param name - nombre del iphone
 * @returns id - id del doc de iphone
 */
export function idByIphoneName(name: string) {
    switch(name){
      case 'IPhone 11': return StockCollections.IPhone11;
      case 'IPhone 11 Pro': return StockCollections.IPhone11Pro;
      case 'IPhone 11 Pro Max': return StockCollections.IPhone11ProMax;
      case 'IPhone 12/12pro': return StockCollections.IPhone12;
      case 'IPhone 12 Mini': return StockCollections.IPhone12Mini;
      case 'IPhone 12 Pro Max': return StockCollections.IPhone12ProMax;
      case 'IPhone X/XS': return StockCollections.IPhoneXS;
      case 'IPhone XS Max': return StockCollections.IPhoneXSMax;
      case 'IPhone XR': return StockCollections.IPhoneXR;
      case 'IPhone 13': return StockCollections.IPhone13;
      case 'IPhone 13 Pro': return StockCollections.IPhone13Pro;
      case 'IPhone 13 Pro Max': return StockCollections.IPhone13ProMax;
      case 'IPhone 13 Mini': return StockCollections.IPhone13Mini;
      case 'IPhone 7/8/SE2020': return StockCollections.IPhoneSE;
      case 'IPhone 7/8 plus': return StockCollections.IPhone8plus;
      case 'Airpods Pro / Airpods 3er gen': return StockCollections.AirpodsPro;
      case 'Airpods 1era gen / 2da gen': return StockCollections.Airpods1era;
      case 'Cable': return StockCollections.Cable;
      case 'Camara': return StockCollections.Camara;
      case 'Mica': return StockCollections.Mica;
      case 'Regalos': return StockCollections.Gift;
      default: return name;
    }
}

/**
 * Devuelve el id del docuemnto segun el mes enviado
 * @param month - number - mes a consultar
 * @returns doc del mes
 */
export function getMonthOnFinaceDOC(month: number) {
    switch (month) {
      case 1: return 'finanzas_enero';
      case 2: return 'finanzas_febrero';
      case 3: return 'finanzas_marzo';
      case 4: return 'finanzas_abril';
      case 5: return 'finanzas_mayo';
      case 6: return 'finanzas_junio'; 
      case 7: return 'finanzas_julio';
      case 8: return 'finanzas_agosto';
      case 9: return 'finanzas_setiembre';
      case 10: return 'finanzas_octubre';
      case 11: return 'finanzas_noviembre';
      case 12: return 'finanzas_diciembre';
      default: return month.toString();
      }
}

/**
 * Devuelve el id del docuemnto segun el mes enviado
 * @param month - number - mes a consultar
 * @returns doc del mes
 */
export function getMonthOnSalesDOC(month: number) {
    switch (month) {
      case 1: return 'ventas_enero';
      case 2: return 'ventas_febrero';
      case 3: return 'ventas_marzo';
      case 4: return 'ventas_abril';
      case 5: return 'ventas_mayo';
      case 6: return 'ventas_junio'; 
      case 7: return 'ventas_julio';
      case 8: return 'ventas_agosto';
      case 9: return 'ventas_setiembre';
      case 10: return 'ventas_octubre';
      case 11: return 'ventas_noviembre';
      case 12: return 'ventas_diciembre';
      default: return month.toString()
      }
}

export function codeForStorage(code: string){
  switch(code){
    case StockCollections.IPhone11: return StorageUrl.IPHONE;
    case StockCollections.IPhone11Pro: return StorageUrl.IPHONE;
    case StockCollections.IPhone11ProMax: return StorageUrl.IPHONE;
    case StockCollections.IPhone12: return StorageUrl.IPHONE;
    case StockCollections.IPhone12Mini: return StorageUrl.IPHONE;
    case StockCollections.IPhone12ProMax: return StorageUrl.IPHONE;
    case StockCollections.IPhoneXS: return StorageUrl.IPHONE;
    case StockCollections.IPhoneXSMax: return StorageUrl.IPHONE;
    case StockCollections.IPhoneXR: return StorageUrl.IPHONE;
    case StockCollections.IPhone13: return StorageUrl.IPHONE;
    case StockCollections.IPhone13Pro: return StorageUrl.IPHONE;
    case StockCollections.IPhone13ProMax: return StorageUrl.IPHONE;
    case StockCollections.IPhone13Mini: return StorageUrl.IPHONE;
    case StockCollections.IPhoneSE: return StorageUrl.IPHONE;
    case StockCollections.IPhone8plus: return StorageUrl.IPHONE;
    case StockCollections.AirpodsPro: return StorageUrl.AIRPODSPRO;
    case StockCollections.Airpods1era: return StorageUrl.AIRPODS;
    case StockCollections.Cable: return StorageUrl.CABLE;
    case StockCollections.Mica: return StorageUrl.MICA;
    case StockCollections.Camara: return StorageUrl.CAMARA;
    default: return code;
  }
}
export function setDashesToName(name: string, code: string) {
  if (name) {
    var lowerCase = name.toLowerCase();
    const onlyFirst = lowerCase.replace(/\s+/g, '-');
    return codeForStorage(code)+onlyFirst+ '.jpg';
  } else {
    return 'error'
  }
}

  