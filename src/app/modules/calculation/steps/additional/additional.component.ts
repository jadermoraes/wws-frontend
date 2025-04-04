import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalculationService } from '../../calculation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WozValues } from 'src/app/shared/interfaces/wozValues';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { StepHandlerService } from '../step-handler.service';

@Component({
  selector: 'app-additional',
  templateUrl: './additional.component.html',
  styleUrls: ['./additional.component.scss'],
})
export class AdditionalComponent implements OnDestroy {
  calculationId: string = '';
  stepId: string = null;

  additional = {
    monument: false,
    careHome: false,
    disabledFacilities: false,
    videoPhone: false,
    renovations: false
  };

  infoVisible = {
    monument: false,
    careHome: false,
    disabledFacilities: false,
    videoPhone: false,
    renovations: false
  };

  fields = [
    {
      key: 'monument',
      label: 'Registered Monument',
      description: 'Indicates whether the building is a protected national monument.'
    },
    {
      key: 'careHome',
      label: 'Care Home',
      description: 'Specify if the property is used as a care home or includes healthcare services.'
    },
    {
      key: 'disabledFacilities',
      label: 'Disabled-Friendly Facilities',
      description: 'Includes facilities accessible to people with disabilities.'
    },
    {
      key: 'videoPhone',
      label: 'Video Phone',
      description: 'Specifies if the unit is equipped with a video intercom system.'
    },
    {
      key: 'renovations',
      label: 'Recently Renovated',
      description: 'Whether the property underwent major renovations recently.'
    }
  ];

  data: any = null;

  constructor(
    private calculationService: CalculationService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private stepHandler: StepHandlerService,
    private router: Router
  ) { }
  
  ngOnInit() {
    const state = history.state;
    this.stepHandler.registerSaveHandler(this.saveStep.bind(this));
    this.calculationId = this.route.parent?.snapshot.paramMap.get('id') || '';
    this.stepId = state?.stepId;

    this.loadData(this.calculationId, this.stepId);
  }

  ngOnDestroy(): void {
    this.stepHandler.clearHandler();
  }

  async loadData(calculationId: string, stepId: string) {
    const self = this;
    this.calculationService.getStepData(calculationId, stepId).subscribe({
      next: async (dataObj) => {
        self.data = dataObj;
        if (dataObj) {
          self.additional.monument = dataObj.monument;
          self.additional.careHome = dataObj.careHome;
          self.additional.disabledFacilities = dataObj.disabledFacilities;
          self.additional.videoPhone = dataObj.videoPhone;
          self.additional.renovations = dataObj.renovations;
        }
      },
      error: (error) => {
        this.toastService.warning('Could not load step data');
        this.router.navigate(['/properties', 'list']);
      }
    });
  }
  
  saveStep(): Promise<any> {
    if (!this.validateNextPage()) {
      return Promise.resolve({ success: false });
    }

    return new Promise((resolve) => {
      this.calculationService.saveStepStep(this.calculationId, this.stepId, this.buildPostData()).subscribe({ 
        next: (data) => {
          if (data.success) {
            this.toastService.success('Step saved successfully');
            resolve({ success: true });
          } else {
            this.toastService.warning(data.message);
            resolve({ success: false, message: 'Could not save step: ' + this.stepId });
          }
        },
        error: (error) => {
          this.toastService.warning('Could not save step: ' + this.stepId);
          resolve({ success: false, message: 'Could not save step: ' + this.stepId });
        },
      });
    });
  }
  

  validateNextPage(): boolean {
    return true;
  }

  buildPostData(): any {
    return {
      monument: this.additional.monument,
      careHome: this.additional.careHome,
      disabledFacilities: this.additional.disabledFacilities,
      videoPhone: this.additional.videoPhone,
      renovations: this.additional.renovations     
    };

  }


  toggleInfo(key: keyof typeof this.infoVisible) {
    this.infoVisible[key] = !this.infoVisible[key];
  }
}

