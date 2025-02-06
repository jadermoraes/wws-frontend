import { DecimalPipe } from '@angular/common';
import { Directive, ElementRef, forwardRef, HostBinding, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { LocaleService } from '../../services/locale.service';

@Directive({
  selector: '[ngModel][wwsNumber]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberDirective),
      multi: true,
    },
  ],
  host: {
    '[value]': 'ngModel',
    '(blur)': 'onBlur()',
    '(focus)': 'onFocus()',
  },
})
export class NumberDirective implements ControlValueAccessor {

  @Input()
  wwsNumberDecimals = 2;

  @Input()
  wwsMaxValue = null;

  @Input()
  wwsMinValue = null;

  @Input()
  wwsAllowEmpty = true;

  @HostBinding('class.input-number') wwsNumberClass = true;

  constructor(
    private el: ElementRef,
    private decimalPipe: DecimalPipe,
    private localeService: LocaleService
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
    let val = this.innerValue.replace(regex, '')
    this.el.nativeElement.value = val;
    this.view = val;
    this.innerValue = val;


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

      this.number = parseFloat(input);
      if ((this.wwsMaxValue != null) && (this.number > this.wwsMaxValue)){
        this.number = parseFloat(this.wwsMaxValue)
      }

      if ((this.wwsMinValue != null) && (this.number < this.wwsMinValue)){
        this.number = parseFloat(this.wwsMinValue)
      }

      this.el.nativeElement.value = this.decimalPipe.transform(this.number, `0.${this.wwsNumberDecimals}-${this.wwsNumberDecimals}`);
      this.innerValue = this.el.nativeElement.value;
    }


    if (input != this.view) {
      this.view = this.el.nativeElement.value;
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
    this.view = this.decimalPipe.transform(parseFloat(val), '1.'+  this.wwsNumberDecimals + '-' + this.wwsNumberDecimals);
    this.innerValue = this.view;
    this.el.nativeElement.value = this.view;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
