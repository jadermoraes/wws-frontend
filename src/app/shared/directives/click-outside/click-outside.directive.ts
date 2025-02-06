import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[wwsClickOutside]',
})
export class ClickOutsideDirective {
  @Output() wwsClickOutside = new EventEmitter<void>();

  @Input('wwsIgnoreDropDownMenu')
  wwsIgnoreDropDownMenu = true;

  constructor(private elementRef: ElementRef) { }

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    let clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside) {
      this.wwsClickOutside.emit();
    }
  }
}
