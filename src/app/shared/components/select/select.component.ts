import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {
  @Input() label: string = '';
  @Input() options: any[] = [];
  @Input() valueKey: string = 'value';
  @Input() labelKey: string = 'label';
  @Input() disabled: boolean = false;
  @Input() model: any;
}
