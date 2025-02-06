import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'wws-dropdown-menu',
  templateUrl: 'dropdown-menu.component.html',
  styleUrls: ['dropdown-menu.component.scss']
})
export class DropdownMenuComponent implements OnInit {

  @Input()
  data = [];

  @Input()
  paramType = null;

  @Input()
  position;

  @Input()
  labelName: string = null

  @Input()
  valueName: string = null

  @Output()
  onSelect: EventEmitter<any> = new EventEmitter();

  mouseoverElement;
  childX: number;
  childY: number;

  constructor() { }

  sendClickEvent(id) {
    this.onSelect.emit([this.paramType, id]);

  }

  ngOnInit() { }


  mouseEnterParent(event, value){
    this.mouseoverElement = value;
    if (this .position == null || this.position === 'top-right'){
      this.childX = event.srcElement.offsetLeft + event.srcElement.clientWidth;
      this.childY = ((event.srcElement.offsetTop + (event.srcElement.clientHeight / 2) + event.srcElement.parentElement.offsetTop) - event.srcElement.parentElement.scrollTop) * -1;
    }
  }

}
