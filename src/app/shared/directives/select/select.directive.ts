import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({ selector: '[wwsSelect]' })
export class SelectDirective implements OnChanges {
  @Input()
  wwsSelectOptions: any[];

  @Input()
  wwsSelectOptionLabel: string = 'label';

  @Input()
  wwsSelectOptionValue: string = 'value';

  @Input()
  wwsSelectPlaceholder: string;

  @HostBinding('class.input-select') wwsSelectClass = true;

  @HostListener('change', ['$event'])
  onSelectChange(event) {
    if (event.srcElement.value === 'undefined') {
      this.ngModel.update.emit(undefined);
    }
  }

  constructor(
    private el: ElementRef,
    private renderer2: Renderer2,
    private ngModel: NgModel
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['wwsSelectOptions']?.currentValue) {
      this.loadOptions(this.wwsSelectOptions);
    }
  }

  private loadOptions(options: SelectOption[]) {
    this.el.nativeElement.innerHTML = '';

    if (this.wwsSelectPlaceholder) {
      const optionElement: HTMLOptionElement =
        this.renderer2.createElement('option');
      optionElement.innerText = this.wwsSelectPlaceholder;
      optionElement.value = undefined;
      this.renderer2.appendChild(this.el.nativeElement, optionElement);
    }

    options?.forEach((option) => {
      const optionElement: HTMLOptionElement =
        this.renderer2.createElement('option');
      optionElement.innerText =
        option[this.wwsSelectOptionLabel] ?? option[this.wwsSelectOptionValue];
      optionElement.value = option[this.wwsSelectOptionValue];
      this.renderer2.appendChild(this.el.nativeElement, optionElement);
    });
  }
}

export interface SelectOption {
  label?: string;
  value?: string;
  checked?: boolean;
}
