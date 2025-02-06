import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appBlurOnEnter]'
})
export class BlurOnEnterDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keyup.enter') onEnter() {
    this.el.nativeElement.blur();
  }
}
