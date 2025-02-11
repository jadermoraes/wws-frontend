import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'wws-card',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class CardComponent {

  @Input() icon: string = '';
  @Input() title!: string;

  constructor(private cdr: ChangeDetectorRef) { }

}
