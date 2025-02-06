import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Toast, ToastService, ToastType } from './toast.service';

@Component({
  selector: 'wws-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ marginLeft: '424px', opacity: 0 }),
            animate('300ms ease-out', style({ marginLeft: 0, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ marginLeft: 0, opacity: 1 }),
            animate('300ms ease-in', style({ marginLeft: '424px', opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class ToastComponent implements OnInit, OnDestroy {
  private readonly TOAST_VISIBILITY_TIME = 5000;
  ToastType = ToastType;
  toasts: Toast[] = [];
  private subscriptions = new Subscription();

  constructor(private toastService: ToastService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.subscriptions.add(this.toastService.pushToast$.subscribe(newToast => {
      this.toasts.push(newToast);
      this.changeDetectorRef.detectChanges();

      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t !== newToast);
        this.changeDetectorRef.detectChanges();
      }, this.TOAST_VISIBILITY_TIME);
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
