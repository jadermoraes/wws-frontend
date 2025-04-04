import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-facility-selector',
  templateUrl: './facility-selector.component.html',
  styleUrls: ['./facility-selector.component.scss']
})
export class FacilitySelectorComponent {
  @Input() show = false;
  @Input() facilities: { id: string; value: string }[] = [];

  @Output() add = new EventEmitter<{ id: string; value: string; quantity: number }>();
  @Output() close = new EventEmitter<void>();

  selectedFacilityId: string | null = null;
  selectedQuantity = 1;

  onConfirm = () => {
    const selected = this.facilities.find(f => f.id === this.selectedFacilityId);
    if (selected) {
        this.add.emit({ ...selected, quantity: this.selectedQuantity });
        this.selectedFacilityId = null;
        this.selectedQuantity = 1;        
    }
    this.onClose();
  }
  

  onClose = () => {
    this.close.emit();
    this.selectedFacilityId = null;
    this.selectedQuantity = 1;
  }
}
