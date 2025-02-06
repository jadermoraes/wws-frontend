import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'wws-icon',
  template: `
    <ng-container *ngIf="isFontAwesome(); else svgTemplate">
      <i
        [class]="icon"
        [ngStyle]="{ fontSize: size + 'px', color: color, transform: rotate }"
        [attr.aria-label]="ariaLabel || icon"
        [class.custom-class]="customClass"
      ></i>
    </ng-container>
    <ng-template #svgTemplate>
      <svg
        *ngIf="icon"
        role="img"
        [style.width.px]="size"
        [style.height.px]="size"
        [style.transform]="rotate"
        [style.fill]="color"
        [attr.aria-label]="ariaLabel || icon"
        [class]="customClass"
        xmlns="http://www.w3.org/2000/svg"
      >
        <use [attr.xlink:href]="'assets/icons.svg#' + icon"></use>
      </svg>
    </ng-template>
  `,
})
export class IconComponent implements OnInit {
  @Input() icon: string;
  @Input() size = 14;
  @Input() color = 'black';
  @Input() rotate = 'rotate(0deg)';
  @Input() ariaLabel: string;
  @Input() customClass: string = '';

  constructor() {}

  ngOnInit() {}

  isFontAwesome(): boolean {
    return (this.icon?.startsWith('fa-') || this.icon?.startsWith('fa fa-'));
  }
}
