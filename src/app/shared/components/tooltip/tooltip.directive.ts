import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { TooltipService } from './tooltip.service';

@Directive({ selector: '[wwsTooltip]' })
export class TooltipDirective implements AfterViewInit {

  @Input('wwsTooltip')
  content: string;

  @Input('wwsTooltipPos')
  position: TooltipPosition = TooltipPosition.TOP;

  @Input('wwsTooltipTimeout')
  tooltipTimeout = 0;

  timeoutId: any;

  constructor(private el: ElementRef, private tooltipService: TooltipService, private renderer2: Renderer2, ) { }


  ngAfterViewInit() {
    const element = this.el.nativeElement;
    element.addEventListener('mouseenter', ()=>{
      this.mouseEnter();
    })
    element.addEventListener('mouseleave', ()=>{
      this.mouseLeave();
    })
  }

  mouseLeave() {
    clearTimeout(this.timeoutId);
    this.tooltipService.hideTooltip();
  }

  mouseEnter() {
    if (!this.content) {
      return;
    }

    const element = this.el.nativeElement;
    var rect = element.getBoundingClientRect();
    let fontsize = element.style.fontSize != "" ? element.style.fontSize : 14;
    let values = this.measureText(element.innerText, fontsize);
    if (values.width > (rect.width * 0.8)) {
      this.timeoutId = setTimeout(() => {
        this.tooltipService.showTooltip({
          content: this.content,
          positionX: rect.left + (rect.width / 4),
          positionY: rect.top - rect.height
        })
      }, this.tooltipTimeout);
    }
  }

  measureText(pText, pFontSize) {
    var lDiv = this.renderer2.createElement('div');   //el.nativeElement.createElement('div');

    document.body.appendChild(lDiv);

    lDiv.style.fontSize = "" + pFontSize + "px";
    lDiv.style.position = "absolute";
    lDiv.style.left = -1000;
    lDiv.style.top = -1000;

    lDiv.innerHTML = pText;

    var lResult = {
        width: lDiv.clientWidth,
        height: lDiv.clientHeight
    };

    document.body.removeChild(lDiv);
    lDiv = null;

    return lResult;
}
}

export enum TooltipPosition {
  TOP
}
