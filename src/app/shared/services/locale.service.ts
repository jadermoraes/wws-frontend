import { getLocaleNumberSymbol, NumberSymbol } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocaleService {

  constructor(
    @Inject(LOCALE_ID) private locale: string
  ) {}

  getDecimalSeparator() {
    return getLocaleNumberSymbol(this.locale, NumberSymbol.Decimal);
  }

  getThousandSeparator() {
    return getLocaleNumberSymbol(this.locale, NumberSymbol.Decimal) === '.' ? ',' : '.';
  }

}
