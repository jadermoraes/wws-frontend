import { Directive, HostBinding, HostListener, Input, Output } from "@angular/core";
import { DragService } from "./drag.service";

@Directive({ selector: '[wwsDrag]'})
export class DragDirective {

  @Input('wwsDrag') dragId: string;

  @Input() wwsDragContent: any;

  constructor(private dragService: DragService) {

  }

  @HostBinding('draggable') draggable = true;

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    this.dragService.startDrag(this.dragId, this.wwsDragContent);
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent) {
    this.dragService.endDrag(this.dragId);
  }

}
