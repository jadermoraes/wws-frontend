import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmationConfig {
  title: string;
  message: string;
  theme?: 'default' | 'danger';
  confirmText?: string; // If provided, user must type this to confirm
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private confirmationSubject = new Subject<boolean | null>();
  private configSubject = new Subject<ConfirmationConfig>();

  getConfirmationConfig() {
    return this.configSubject.asObservable();
  }

  getConfirmationResponse() {
    return this.confirmationSubject.asObservable();
  }

  confirm(config: ConfirmationConfig): Promise<boolean> {
    this.configSubject.next(config);
    return new Promise((resolve) => {
      this.getConfirmationResponse().subscribe(response => {
        resolve(response === true);
      });
    });
  }

  respond(response: boolean | null) {
    this.confirmationSubject.next(response);
  }
}
