import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class TooltipService {
  tooltipShow$ = new Subject<ShowTooltipEvent>()
  tooltipHide$ = new Subject<void>()
  constructor() { }

  showTooltip(event: ShowTooltipEvent){
    this.tooltipShow$.next(event)
  }

  hideTooltip(){
    this.tooltipHide$.next()
  }
}

export interface ShowTooltipEvent {
  positionX?: number;
  positionY?: number;
  content?: string;
}
