import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { DragService } from "./drag.service";

@Directive({ selector: '[wwsDrop]' })
export class DropDirective {

  @Input('wwsDrop') dragId: string;

  @Output() wwsOnDrop = new EventEmitter<DropEvent<any>>();

  @HostBinding('class.dropping-before')
  isDroppingBefore = false;

  @HostBinding('class.dropping-after')
  isDroppingAfter = false;

  @HostListener('dragover', ['$event'])
  dragover(event: DragEvent) {
    event.preventDefault();

    let element = this.el.nativeElement;

    let elementHeight = element.getBoundingClientRect().height;
    let mouseY = event.clientY;
    let elementY = element.getBoundingClientRect().top;
    let elementMiddle = elementY + (elementHeight / 2);
    let isDropBefore = mouseY < elementMiddle;

    this.isDroppingBefore = isDropBefore;
    this.isDroppingAfter = !isDropBefore;
  }

  @HostListener('dragleave', ['$event'])
  dragleave(event: DragEvent) {
    this.clear();
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();

    if (this.dragId === this.dragService.id) {
      this.wwsOnDrop.emit({
        content: this.dragService.content,
        isDroppingBefore: this.isDroppingBefore,
      });
      this.dragService.endDrag(this.dragId);
    }
  }

  private subscription = new Subscription();

  constructor(private dragService: DragService, private el: ElementRef) {
    this.subscription.add(
      this.dragService.dragEnd$.subscribe(() => {
        this.clear();
      })
    );
  }

  private clear() {
    this.isDroppingBefore = false;
    this.isDroppingAfter = false;
  }

}

export interface DropEvent<T> {
  content: T;
  isDroppingBefore: boolean;
}
