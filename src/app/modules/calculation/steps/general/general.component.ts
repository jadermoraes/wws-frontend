import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalculationService } from '../../calculation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WozValues } from 'src/app/shared/interfaces/wozValues';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { StepHandlerService } from '../step-handler.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnDestroy {
  calculationId: string = '';
  selectedWozValue: string = null;
  wozAmounts: WozValues[] = [];
  showAddWozValueModal: boolean = false;
  addressSelectionModal: any = null;
  selectedAddress: string = '';
  manualWozValue: number | null = null;
  enableManualOverride: boolean = false;
  validBagId: boolean = false;
  selectedLabelType: string = '';
  selectedEnergyLabel: string = '';
  selectedEnergyIndex: string = '';
  selectedSurfaceArea: string = '';
  energyLabelApiData: any = null;
  showElInfo = false;
  stepId: string = null;
  wozFetched: boolean = false;


  data: any = null;

  energyLabelTypes = [
    { value: 'label', label: 'Energy Label' },
    { value: 'index', label: 'Energy Index' },
    { value: 'label_new', label: 'Energy Label (since 1/1/21)' },
    { value: 'none', label: 'No Energy Label' }
  ];
  
  energyLabelOptions = [
    'A++++', 'A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'
  ];
  
  energyIndexRanges = [
    '<=0.6', '0.6 - 0.8', '0.8 - 1.2', '1.2 - 1.4',
    '1.4 - 1.8', '1.8 - 2.1', '2.1 - 2.4', '2.4 - 2.7', '>2.7', 'Energy performance fee'
  ];  
  

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
    await this.validateBagId(this.calculationId, null);
    const self = this;
    this.calculationService.getStepData(calculationId, stepId).subscribe({
      next: async (dataObj) => {
        self.data = dataObj;
        if (self.data) {
          if (!self.data.isWozManual) {
            await self.loadWozValues();
          }
          setTimeout(() => {
            self.manualWozValue = self.data.wozAmount;
            self.enableManualOverride = self.data.isWozManual;
            self.selectedLabelType = self.data.elType;
            self.selectedEnergyLabel = self.data.elLabel;
            self.selectedEnergyIndex = self.data.elIndexRange;
            self.selectedSurfaceArea = self.data.elSurfaceCategory;
          }, 100);
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
  

  validateBagId(calculation: string, addressId: string): void {
    this.calculationService.validateBagId(calculation, addressId).subscribe((data) => {
      if (data.success) {
        this.setValidBagOps(true);
      } else {
        if (data.addresses) {
          this.showAddressSelectionModal(data.addresses);
        } else {
          this.setValidBagOps(false);
        }
      }
    });
  }

  showAddressSelectionModal(addresses: any) {
    this.showAddWozValueModal = true;
    this.addressSelectionModal = addresses;
  }

  closeAddressModal() {
    this.showAddWozValueModal = false;
    this.addressSelectionModal = null;
  }

  async selectAddress() {
    await this.calculationService.validateBagId(this.calculationId, this.selectedAddress);
    this.closeAddressModal();
  }

  selectCard(addr: any) {
    this.selectedAddress = addr;
  }

  setValidBagOps(valid: boolean) {
    this.validBagId = valid;    
  }


  loadWozValues(): void {
    this.calculationService.getWozValues(this.calculationId).subscribe((data) => {
      if (data.success) {
        if (data.wozData) {
          this.wozAmounts = data.wozData;
          if (this.wozAmounts.length > 0 && !this.selectedWozValue) {
            this.selectedWozValue = this.wozAmounts[0].period;
          }
        } else {
          this.showAddressSelectionModal(data.addresses);
        }          
      } else {
        this.toastService.warning(data.message);
      }

      this.wozFetched = true;
    });
  }

  getWozByPeriod(period: string): WozValues | null {
    return this.wozAmounts.find(woz => woz.period === period) || null;
  }

  loadEnergyLabelData(): void {
    if (!this.validBagId) {
      this.toastService.warning('BAG ID is missing or invalid. Cannot fetch energy label data.');
      return;
    }
  
    this.calculationService.getElData(this.calculationId).subscribe((data) => {
      if (data.success) {
        if (data.elData) {
          this.energyLabelApiData = data.elData;

          this.applyEnergyLabelRules(this.energyLabelApiData);
        } else {
          this.toastService.warning('No energy label data found for this address.');
        }
      } else {
        this.toastService.warning(data.message || 'Could not retrieve energy label data.');
      }
    });
  }

  applyEnergyLabelRules(apiData: any): void {
    const registrationDate = new Date(apiData.Registratiedatum);
    const index = apiData.EnergieIndex;
    const label = apiData.Energieklasse;
  
    const cutoff2021 = new Date('2021-01-01');
    const cutoff2015 = new Date('2015-01-01');
  
    if (registrationDate >= cutoff2021) {
      this.selectedLabelType = 'label_new';
      this.selectedEnergyLabel = label;
      
    } else if (registrationDate >= cutoff2015 && index) {
      this.selectedLabelType = 'index';
      this.selectedEnergyIndex = this.getIndexRange(index);
    } else {
      this.selectedLabelType = 'label';
      this.selectedEnergyLabel = label;
    }
  }

  
  getIndexRange(value: number): string {
    if (value <= 0.6) return '<=0.6';
    if (value <= 0.8) return '0.6 - 0.8';
    if (value <= 1.2) return '0.8 - 1.2';
    if (value <= 1.4) return '1.2 - 1.4';
    if (value <= 1.8) return '1.4 - 1.8';
    if (value <= 2.1) return '1.8 - 2.1';
    if (value <= 2.4) return '2.1 - 2.4';
    if (value <= 2.7) return '2.4 - 2.7';
    return '>2.7';
  }  

  validateNextPage(): boolean {
    if (!this.selectedWozValue && !this.manualWozValue) {
      this.toastService.warning('Please select or enter a WOZ value.');
      return false;
    }

    if (this.enableManualOverride && !this.manualWozValue) {
      this.toastService.warning('Manual override is enabled, but no manual WOZ value is provided.');
      return false;
    }

    if (!this.selectedLabelType) {
      this.toastService.warning('Please select an energy label type.');
      return false;
    }

    if (this.selectedLabelType === 'label' && !this.selectedEnergyLabel) {
      this.toastService.warning('Please select an energy label.');
      return false;
    }

    if (this.selectedLabelType === 'index' && !this.selectedEnergyIndex) {
      this.toastService.warning('Please select an energy index.');
      return false;
    }

    if (this.selectedLabelType === 'label_new' && !this.selectedSurfaceArea) {
      this.toastService.warning('Please enter the surface area.');
      return false;
    }

    return true;
  }

  buildPostData(): any {
    const wozValue = this.enableManualOverride ? null : this.wozAmounts.find(woz => woz.period === this.selectedWozValue);

    return {
      calculationId: this.calculationId,
      wozPeriod: this.manualWozValue || wozValue.period,
      wozAmount: this.manualWozValue || wozValue.wozAmount,
      isWozManual: this.enableManualOverride,
      elType: this.selectedLabelType,
      elLabel: this.selectedLabelType === 'label' ? this.selectedEnergyLabel : null,
      elSurfaceCategory: this.selectedLabelType === 'label_new' ? this.selectedSurfaceArea : null,
      elIndexRange: this.selectedLabelType === 'index' ? this.selectedEnergyIndex : null
    };

  }
}

