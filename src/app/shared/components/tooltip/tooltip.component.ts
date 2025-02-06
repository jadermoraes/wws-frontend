import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShowTooltipEvent, TooltipService } from './tooltip.service';

@Component({
  selector: 'wws-tooltip',
  templateUrl: 'tooltip.component.html',
  styleUrls: ['tooltip.component.scss']
})

export class TooltipComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  isVisible = false;
  positionX: number;
  positionY: number;
  content: string;

  constructor(private tooltipService: TooltipService) { }

  ngOnInit() {
    this.subscriptions.add(this.tooltipService.tooltipShow$.subscribe(event => {
      this.showTooltip(event);
    }));

    this.subscriptions.add(this.tooltipService.tooltipHide$.subscribe(() => {
      this.hideTooltip();
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  hideTooltip() {
    this.isVisible = false;
  }
  showTooltip(event: ShowTooltipEvent) {
    this.isVisible = true;
    this.positionX = event.positionX;
    this.positionY = event.positionY;
    this.content = event.content;
  }
}
