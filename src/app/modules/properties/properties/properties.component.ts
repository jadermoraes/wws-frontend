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
  @ViewChild('pointsTemplate', { static: false }) pointsTemplate!: TemplateRef<any>;
  @ViewChild('imgTemplate', { static: false }) imgTemplate!: TemplateRef<any>;

  constructor(private route: ActivatedRoute, 
    private toastService: ToastService,
    private translate: TranslateService,
    private propertyService: PropertyService,
    private router: Router
  ) { }

  ngOnInit() {
    this.propertyService.getProperties().subscribe((data) => {
      let actionsHdr = data.headers.find(h => h.key === 'actions');
      if (actionsHdr) {
        actionsHdr.customTemplates = {
          'propertyActions': this.actionProperties,
        }
      }

      let imgTemplateHdr = data.headers.find(h => h.key === 'imgTemplate');
      if (imgTemplateHdr) {
        imgTemplateHdr.customTemplates = {
          'imgTemplate': this.imgTemplate,
        }
      }

      this.propertyList = data;
    });
  }  

  navigateToProperty(path: string) {
    this.router.navigate(['/properties/property/' + path]);
  }
  
  newCalculation(id: string) {
    this.router.navigate([`/calculations/${id}/new`]);

  }
}
