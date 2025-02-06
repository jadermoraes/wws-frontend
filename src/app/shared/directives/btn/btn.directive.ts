import { Directive, HostBinding, Input } from '@angular/core';

export enum BtnType {
  DEFAULT = 'default',
  PRIMARY = 'primary',
  SUCCESS = 'success',
  DANGER = 'danger',
  SUBTLE = 'subtle'
}

@Directive({ selector: '[wwsBtn]' })
export class BtnDirective {

  @Input('wwsBtn')
  set wwsBtn(value: BtnType) {
    this.isDefault = false;
    this.isPrimary = false;
    this.isSuccess = false;
    this.isDanger = false;
    this.isSubtle = false;

    switch (value) {
      case BtnType.DEFAULT: this.isDefault = true; break;
      case BtnType.PRIMARY: this.isPrimary = true; break;
      case BtnType.SUCCESS: this.isSuccess = true; break;
      case BtnType.DANGER: this.isDanger = true; break;
      case BtnType.SUBTLE: this.isSubtle = true; break;
      default: this.isDefault = true; break;
    }
  }

  @Input('wwsBtnSmall')
  set wwsBtnSmall(value: boolean) {
    this.isSmall = value !== false;
  }

  @HostBinding('class.btn') wwsBtnClass = true;

  @HostBinding('class.btn--default') isDefault = false;
  @HostBinding('class.btn--primary') isPrimary = false;
  @HostBinding('class.btn--success') isSuccess = false;
  @HostBinding('class.btn--danger') isDanger = false;
  @HostBinding('class.btn--subtle') isSubtle = false;
  @HostBinding('class.btn--small') isSmall = false;

  constructor() { }
}
