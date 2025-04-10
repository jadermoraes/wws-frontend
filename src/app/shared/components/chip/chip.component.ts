import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent {
  @Input() text: string = '';
  @Input() status: 'default' | 'success' | 'warning' | 'error' | 'pending' = 'default'; // Status types
}
