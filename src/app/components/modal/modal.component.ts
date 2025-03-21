import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

interface ModalAction {
  title: string;
  type: 'primary' | 'secondary' | 'danger' | 'link';
  position?: 'left' | 'center' | 'right';
  action: () => void;
  disabled?: boolean;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnChanges {
  @Input() title: string = '';
  @Input() show: boolean = false;
  @Input() actions: ModalAction[] = [];
  @Output() onClose = new EventEmitter<void>();

  leftActions: ModalAction[] = [];
  centerActions: ModalAction[] = [];
  rightActions: ModalAction[] = [];
  showActions: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['actions']) {
      this.updateActionPositions();
    }

    if (changes['show'] && !changes['show'].currentValue) {
      this.onClose.emit();
    }
  }

  updateActionPositions(): void {
    this.showActions = this.actions.length > 0;
    this.leftActions = this.actions.filter(a => a.position === 'left');
    this.centerActions = this.actions.filter(a => a.position === 'center');
    this.rightActions = this.actions.filter(a => a.position === 'right');
  }

  close() {
    this.onClose.emit();
  }

  triggerAction(action: ModalAction) {
    if (action.disabled) {
      return;
    }
    action.action();
  }
}
