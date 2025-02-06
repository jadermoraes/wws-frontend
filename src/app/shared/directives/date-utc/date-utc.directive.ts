import { Directive, ElementRef, forwardRef, HostBinding, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { LocaleService } from '../../services/locale.service';

@Directive({
  selector: '[ngModel][wwsDateUtc]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateUtcDirective),
      multi: true,
    },
  ],
  host: {
    '[value]': 'ngModel',
    '(blur)': 'onBlur()',
  },
})
export class DateUtcDirective implements ControlValueAccessor {

  @Input()
  wwsIgnoreTimeZone = false;

  @HostBinding('class.input-date-utc') wwsDateUtcClass = true;

  public onChangeCallback: any = (val) => {
    this.writeValue(val);
  }

  public onTouched: any = () => {
  }

  constructor(
    private el: ElementRef,
    private localeService: LocaleService
  ) {}

  onBlur() {
    const offsetHours = new Date().getTimezoneOffset() / 60;
    const newValue = new Date(this.el.nativeElement.value);
    if (this.wwsIgnoreTimeZone === false) {
      if (offsetHours > 0) {
        newValue.setHours(newValue.getHours() + offsetHours);
      }
      else if (offsetHours  < 0) {
        newValue.setHours(newValue.getHours() - offsetHours);
      }
    }

    this.onChangeCallback(newValue);

  }

  writeValue(obj: any): void {
    if (obj) {
      const offsetHours = new Date().getTimezoneOffset() / 60;
      const newValue = new Date(obj);

      if (newValue.getHours() == 0 && newValue.getMinutes() == 0 && newValue.getSeconds() == 0) {
        this.el.nativeElement.value = obj.substr(0,10);
      } else {
        if (offsetHours > 0) {
          newValue.setHours(newValue.getHours() + offsetHours);
        }
        else if (offsetHours  < 0) {
          newValue.setHours(newValue.getHours() - offsetHours);
        }
        this.el.nativeElement.value = newValue.toISOString().substr(0, 10);
      }
    }
    else {
      this.el.nativeElement.value = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

}
