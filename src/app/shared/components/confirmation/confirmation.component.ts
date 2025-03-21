import { Component, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmationConfig } from '../../services/confirmation.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  showModal = false;
  config: ConfirmationConfig = { title: '', message: '', theme: 'default' };
  userInput: string = '';

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.confirmationService.getConfirmationConfig().subscribe(config => {
      this.config = config;
      this.userInput = ''; // Reset input field
      this.showModal = true;
    });
  }

  closeModal() {
    this.showModal = false;
    this.confirmationService.respond(null);
  }

  confirm() {
    if (this.config.confirmText && this.userInput !== this.config.confirmText) {
      return; // Don't confirm if input doesn't match expected text
    }
    this.showModal = false;
    this.confirmationService.respond(true);
  }
}
