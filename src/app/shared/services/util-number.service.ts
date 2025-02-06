import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilNumberService {
  constructor() {}

  convertToInternationalCurrencySystem(value: any) {
    return Math.abs(Number(value)) >= 1.0e9
      ? (Math.abs(Number(value)) / 1.0e9).toFixed(2) + 'B'
      :
      Math.abs(Number(value)) >= 1.0e6
      ? (Math.abs(Number(value)) / 1.0e6).toFixed(2) + 'M'
      :
      Math.abs(Number(value)) >= 1.0e3
      ? (Math.abs(Number(value)) / 1.0e3).toFixed(2) + 'K'
      : Math.abs(Number(value));
  }

  convertToMillions(value: any) {
    return Math.abs(Number(value)) / 1.0e6;
  }
}

export enum DoubleFormat {
  TWO_DECIMALS,
  ZERO_DECIMALS,
  MLN_DECIMALS,
}
