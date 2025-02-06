import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'at-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.css']
})
export class ToggleSwitchComponent implements OnChanges {
  @Input() checked: boolean = false;
  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['checked']) {
      this.checked = changes['checked'].currentValue;
    }
  }

  toggle() {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
