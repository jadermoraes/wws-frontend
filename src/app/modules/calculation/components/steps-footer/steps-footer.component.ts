import { Component, Input } from '@angular/core';

export interface FooterAction {
  label: string;
  type: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  position: 'left' | 'center' | 'right';
  width?: string;
  disabled?: boolean;
  hidden?: boolean;
  action: () => void;
}

@Component({
  selector: 'app-steps-footer',
  templateUrl: './steps-footer.component.html',
  styleUrls: ['./steps-footer.component.scss']
})
export class StepsFooterComponent {
  @Input() actions: FooterAction[] = [];

  get leftActions(): FooterAction[] {
    return this.actions.filter(a => a.position === 'left' && !a.hidden);
  }

  get centerActions(): FooterAction[] {
    return this.actions.filter(a => a.position === 'center' && !a.hidden);
  }

  get rightActions(): FooterAction[] {
    return this.actions.filter(a => a.position === 'right' && !a.hidden);
  }

  handleAction(action: FooterAction) {
    if (action.action) {
      action.action();
    }
  }
}
