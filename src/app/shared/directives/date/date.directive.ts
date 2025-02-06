import { Directive, HostBinding } from '@angular/core';

@Directive({ selector: '[wwsDate]' })
export class DateDirective {

  @HostBinding('class.input-date') wwsDateClass = true;

  constructor() {}

}
