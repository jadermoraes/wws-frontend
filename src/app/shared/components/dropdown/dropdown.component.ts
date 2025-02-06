import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'wws-dropdown',
  templateUrl: 'dropdown.component.html',
  styleUrls: ['dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  @Input()
  position = 'bottom-right';

  @Input()
  closeOnClick = true;

  showDropdown = false;

  constructor() { }

  ngOnInit() { }


}
