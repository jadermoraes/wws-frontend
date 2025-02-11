import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Property } from 'src/app/shared/interfaces/property';
import { PropertyService } from '../property.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { TableData } from 'src/app/shared/interfaces/tableData';

@Component({
  selector: 'wws-properties',
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss'
})
export class PropertiesComponent implements OnInit {
  propertyList: TableData = null;

  @ViewChild('actionProperties', { static: false }) actionProperties!: TemplateRef<any>;

  constructor(private route: ActivatedRoute, 
    private toastService: ToastService,
    private translate: TranslateService,
    private propertyService: PropertyService,
    private router: Router
  ) { }

  ngOnInit() {
    this.propertyService.getProperties().subscribe((data) => {
      data.headers.find(h => h.key === 'actions').customTemplates = {
        'propertyActions': this.actionProperties,
      }

      this.propertyList = data;
    });
  }  

  navigateToProperty(path: string) {
    this.router.navigate(['/properties/property/' + path]);
  }
}
