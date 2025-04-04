import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { StepHandlerService } from '../step-handler.service';
import { ActivatedRoute } from '@angular/router';
import { CalculationService } from '../../calculation.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';

@Component({
  selector: 'app-kitchens',
  templateUrl: './kitchens.component.html',
  styleUrls: ['./kitchens.component.scss'],
})

export class KitchensComponent {
  // showAddSpaceModal: boolean = false;
  calculationId: string = '';
  stepId: string = '';
  kitchens: any[] = [];
  data: any = null;
  showFacilityModal = false;
  availableFacilities = [];
  selectedKitchenForFacility = null;

  countertopLengthRanges = [
    { label: '0 - 0.5 m', value: '0-0.5' },
    { label: '0.5 - 1 m', value: '0.5-1' },
    { label: '1 - 2 m', value: '1-2' },
    { label: 'More than 2 m', value: '>2' }
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

    this.loadKitchenFacilities();
  }

  async loadKitchenFacilities() {
    return this.calculationService.getKitchenFacilities().subscribe({
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
          dataObj.forEach((kitchen) => {
            self.kitchens.push({
              kitchenId: kitchen.kitchenId,
              spaceId: kitchen.spaceId,
              spaceName: kitchen.spaceName,
              kitchenCounterTop: kitchen.kitchenCountertopLength,
              kitchenFacilities: kitchen.kitchenFacilities,
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
    for (const kitchen of this.kitchens) {
      if (!kitchen.kitchenCounterTop) {
        this.toastService.warning('Please select a countertop length for each kitchen');
        return false;
      }
    }

    return true;
  }

  buildPostData(): any {
    return this.kitchens.map(kitchen => ({
      kitchenId: kitchen.kitchenId,
      spaceId: kitchen.spaceId,
      kitchenCounterTop: kitchen.kitchenCounterTop,
      kitchenFacilities: kitchen.kitchenFacilities,
    }));
  }
  
  openFacilityModal(kitchen) {
    this.selectedKitchenForFacility = kitchen;
    this.showFacilityModal = true;
  }

  addFacility(kitchen, facility) {
    kitchen.kitchenFacilities.push(facility);
  }
  
  removeFacility(kitchen, facility: any) {
    kitchen.kitchenFacilities = kitchen.kitchenFacilities.filter(f => f.id !== facility.id);
  }

  getAvailableFacilities(kitchen) {
    if (!kitchen || !kitchen.kitchenFacilities) {
      return this.availableFacilities;
    }
    return this.availableFacilities.filter(f => !kitchen.kitchenFacilities.find(kf => kf.id === f.id));
  }
}
