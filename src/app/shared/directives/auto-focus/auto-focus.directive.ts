import {
  AfterViewInit,
  Directive,
  ElementRef,
} from '@angular/core';

@Directive({
  selector: '[wwsAutoFocus]'
})
export class AutoFocusDirective implements AfterViewInit  {

  constructor(private elmRef: ElementRef) {}

  ngAfterViewInit () {
    this.setFocus();
  }

  private setFocus () {
      this.elmRef.nativeElement.focus();
      this.elmRef.nativeElement.select();
      setTimeout (() => {
        this.elmRef.nativeElement.select();
     }, 50);
  }
}
