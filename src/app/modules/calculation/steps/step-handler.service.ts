import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StepHandlerService {
  private onSaveHandler: (() => void | Promise<any>) | null = null;

  registerSaveHandler(fn: () => void | Promise<any>) {
    this.onSaveHandler = fn;
  }

  async triggerSave() {
    return await this.onSaveHandler?.();
  }
  
  clearHandler() {
    this.onSaveHandler = null;
  }
}
