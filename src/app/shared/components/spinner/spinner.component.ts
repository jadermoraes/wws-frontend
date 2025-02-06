import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wws-spinner',
  templateUrl: 'spinner.component.html',
  styleUrls: ['spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  @Input() message = '';

  @Input() width;

  @Input() height;

  constructor() { }

  ngOnInit() {
  }
}
