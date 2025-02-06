import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DragService {
  id: string;
  content: any;

  dragEnd$: Subject<string>;

  constructor() {
    this.dragEnd$ = new Subject();
  }

  startDrag(dragId: string, dragContent: any) {
    this.id = dragId;
    this.content = dragContent;
  }

  endDrag(dragId: string) {
    this.dragEnd$.next(dragId);
    this.id = null;
    this.content = null;
  }

}
