import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum ToastType {
  SUCCESS,
  DANGER,
  WARNING
}

export interface Toast {
  type: ToastType;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  pushToast$ = new Subject<Toast>();

  constructor() {}

  success(text: string) {
    this.pushToast$.next({
      type: ToastType.SUCCESS,
      text: text
    });
  }

  danger(text: string) {
    this.pushToast$.next({
      type: ToastType.DANGER,
      text: text
    });
  }

  warning(text: string) {
    this.pushToast$.next({
      type: ToastType.WARNING,
      text: text
    });
  }
}
