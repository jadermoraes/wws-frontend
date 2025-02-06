import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'wws-label',
  templateUrl: 'label.component.html',
  styleUrls: ['label.component.scss']
})
export class LabelComponent implements OnInit {
  isRequired;
  inputId;

  @Input()
  fontSize = 14;

  @Input()
  bold: Boolean = true;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    let input = this.el.nativeElement.parentElement.querySelector('input');
    if (input == null) {
      let select = this.el.nativeElement.parentElement.querySelector('select');
      if (select == null) {
        return
      }
      this.isRequired = select.attributes.required?.specified;
      this.inputId = select.attributes.id?.value || select.attributes.name?.value;
    } else {
      !input && (input = this.el.nativeElement.parentElement.querySelector('select'));
      !input && (input = this.el.nativeElement.parentElement.querySelector('textarea'));

      this.isRequired = input.attributes.required?.specified;
      this.inputId = input.attributes.id?.value || input.attributes.name?.value;
    }
  }
}
