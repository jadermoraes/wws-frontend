import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { StepHandlerService } from '../step-handler.service';
import { ActivatedRoute } from '@angular/router';
import { CalculationService } from '../../calculation.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';

@Component({
  selector: 'app-toilets',
  templateUrl: './toilets.component.html',
  styleUrls: ['./toilets.component.scss'],
})

export class ToiletsComponent {
  calculationId: string = '';
  stepId: string = '';
  toilets: any[] = [];
  data: any = null;
  showFacilityModal = false;
  availableFacilities = [];
  selectedToiletForFacility = null;

  bathOptions = [
    { label: 'None', value: 'none' },
    { label: 'Shower', value: 'shower' },
    { label: 'Bath', value: 'bath' },
    { label: 'Both', value: 'both' }
  ];
  

  constructor(
    private stepHandler: StepHandlerService,
    private route: ActivatedRoute,
    private calculationService: CalculationService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    const state = history.state;
    this.stepHandler.registerSaveHandler(this.saveStep.bind(this));
    this.calculationId = this.route.parent?.snapshot.paramMap.get('id') || '';
    this.stepId = state?.stepId;

    this.loadToiletFacilities();
  }

  async loadToiletFacilities() {
    return this.calculationService.getToiletFacilities().subscribe({
      next: (data) => {
        this.availableFacilities = data;

        this.loadData(this.calculationId, this.stepId);
      }
    });
  }

  async loadData(calculationId: string, stepId: string) {

    let self = this;
    this.calculationService.getStepData(calculationId, stepId).subscribe({
      next: (dataObj) => {
        self.data = dataObj;
        if (dataObj && dataObj.length > 0) {
          dataObj.forEach((toilet) => {
            self.toilets.push({
              toiletId: toilet.toiletId,
              spaceId: toilet.spaceId,
              spaceName: toilet.spaceName,
              regularToilets: toilet.toilets,
              floatingToilets: toilet.floatingToilets,
              singleWashbasin: toilet.singleWashbasins,
              multiWashbasin: toilet.multiWashbasins,              
              toiletFacilities: toilet.toiletFacilities,
            })
          });          
        }
      },
      error: (error) => {
        console.error('Could not load step data');
      }
    });
  }

  ngOnDestroy(): void {
    this.stepHandler.clearHandler();
  }
  
  saveStep() {
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
    for (const toilet of this.toilets) {
      if (!toilet.regularToilets && !toilet.floatingToilets) {
        this.toastService.warning('Please enter the number of regular or floating toilets');
        return false;
      }
      if (!toilet.singleWashbasin && !toilet.multiWashbasin) {
        this.toastService.warning('Please enter the number of single or multi washbasins');
        return false;
      }
      
      if (!this.bathOptions.some(option => option.value === toilet.bathOption)) {
        this.toastService.warning('Please select a valid bath option');
        return false;
      }
    }

    return true;
  }

  buildPostData(): any {
    return this.toilets.map(toilet => ({
      toiletId: toilet.toiletId,
      spaceId: toilet.spaceId,
      regularToilets: toilet.regularToilets,
      floatingToilets: toilet.floatingToilets,
      singleWashbasin: toilet.singleWashbasin,
      multiWashbasin: toilet.multiWashbasin,
      showerType: toilet.bathOption,
      toiletFacilities: toilet.toiletFacilities,
    }));
  }
  
  openFacilityModal(toilet) {
    this.selectedToiletForFacility = toilet;
    this.showFacilityModal = true;
  }

  addFacility(toilet, facility) {
    toilet.toiletFacilities.push(facility);
  }
  
  removeFacility(toilet, facility: any) {
    toilet.toiletFacilities = toilet.toiletFacilities.filter(f => f.id !== facility.id);
  }

  getAvailableFacilities(toilet) {
    if (!toilet || !toilet.toiletFacilities) {
      return this.availableFacilities;
    }
    return this.availableFacilities.filter(f => !toilet.toiletFacilities.find(kf => kf.id === f.id));
  }
}
