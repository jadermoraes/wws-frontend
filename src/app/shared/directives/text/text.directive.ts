import { Directive, HostBinding } from '@angular/core';

@Directive({ selector: '[wwsText]' })
export class TextDirective {

  @HostBinding('class.input-text') fsTextClass = true;

  constructor() {}

}
