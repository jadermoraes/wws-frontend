import { DecimalPipe } from '@angular/common';
import { Directive, ElementRef, forwardRef, HostBinding, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LocaleService } from '../../services/locale.service';

@Directive({
  selector: '[ngModel][wwsPercentage]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PercentageDirective),
      multi: true,
    },
  ],
  host: {
    '[value]': 'ngModel',
    '(blur)': 'onBlur()',
    '(focus)': 'onFocus()',
  },
})
export class PercentageDirective implements ControlValueAccessor {

  @Input()
  wwsPercentageDecimals = 2;

  @Input()
  wwsAllowEmpty = true;

  @HostBinding('class.input-percentage') wwsPercentageClass = true;

  constructor(
    private el: ElementRef,
    private localeService: LocaleService,
    private decimalPipe: DecimalPipe
  ) {}

  private innerValue: string;
  private view: string;
  private number: number;

  public onChangeCallback: any = () => {
  };

  public onTouched: any = () => {
  };

  onFocus() {
    if (!this.innerValue) return;

    const thousandSep = this.localeService.getThousandSeparator();
    const regex = new RegExp('\\' + thousandSep, 'g');
    let val = this.innerValue.replace(regex, '');
    val = val.replace('\%', '');

    this.innerValue = val;
    this.el.nativeElement.value = val;
  }

  onBlur() {
    let input = this.el.nativeElement.value;
    if (input === null || input === undefined || input === '') {
      this.number = null;
      if (this.wwsAllowEmpty){
        this.view = null;
      }
      this.el.nativeElement.value = this.view;
      this.innerValue = this.view;
    } else {
      if (this.localeService.getDecimalSeparator() === ',') {
        input = input.replace(/\./g, '');
        input = input.replace(',', '.');
      }

      this.number = parseFloat(input) / 100;
      this.el.nativeElement.value = this.decimalPipe.transform(this.number * 100, `0.${this.wwsPercentageDecimals}-${this.wwsPercentageDecimals}`) + '%';
      this.innerValue = this.el.nativeElement.value;
    }


    if (input != this.view) {
      this.onChangeCallback(this.number);
    }
  }

  get value(): any {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  writeValue(val: string): void {
    this.number = parseFloat(val);
    if (val) {
      this.view = this.decimalPipe.transform(this.number * 100, `0.${this.wwsPercentageDecimals}-${this.wwsPercentageDecimals}`) + '%';
    } else {
      this.view = null;
    }
    this.el.nativeElement.value = this.view;
    this.innerValue = this.view;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
