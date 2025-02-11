import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-subheader',
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.scss']
})
export class SubheaderComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) {}

  @ContentChild(TemplateRef) contentTemplate!: TemplateRef<any>;
  @Input() template!: TemplateRef<any>;

  ngOnInit() {
  }
}
