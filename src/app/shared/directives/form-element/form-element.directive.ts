import { Directive, HostBinding, Input } from '@angular/core';

@Directive({ selector: '[wwsFormElement]' })
export class FormElementDirective {

  @Input()
  set wwsFormElementNoMargin(val) {
    this.marginBottomClass = val !== true;
  }

  @HostBinding('class.m-b-md') marginBottomClass = true;


  constructor() {}
}
