import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'wws-card',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.scss']
})

export class CardComponent implements OnInit {

  @Input()
  showBackButton = false

  @Input()
  label: string;

  @Input()
  subLabel: string;

  @Input()
  showFooter = false;

  @Input()
  cardHeight: string = '100%';

  @Input()
  class;

  @Input()
  hideContentPadding = false;

  @Output()
  back = new EventEmitter<void>();

  constructor() { }

  ngOnInit() { }

}
