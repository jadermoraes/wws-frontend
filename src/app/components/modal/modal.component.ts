import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() show: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onAction = new EventEmitter<void>();

  close() {
    this.onClose.emit();
  }

  action() {
    this.onAction.emit();
  }
}
