import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalculationService } from '../../calculation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WozValues } from 'src/app/shared/interfaces/wozValues';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { StepHandlerService } from '../step-handler.service';
import { ConfirmationComponent } from 'src/app/shared/components/confirmation/confirmation.component';
import { ConfirmationService } from 'src/app/shared/services/confirmation.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnDestroy {
  calculationId: string = '';
  stepId: string = null;

  summary: any = null;
  spaceGroups: any = [];

  data: any = null;

  constructor(
    private calculationService: CalculationService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private stepHandler: StepHandlerService,
    private router: Router,
    private confirmationService: ConfirmationService,
  ) { }
  
  ngOnInit() {
    const state = history.state;
    this.stepHandler.registerSaveHandler(this.saveStep.bind(this));
    this.calculationId = this.route.parent?.snapshot.paramMap.get('id') || '';
    this.stepId = state?.stepId;

    this.loadSpaceGroups();
  }

  ngOnDestroy(): void {
    this.stepHandler.clearHandler();
  }

  async loadSpaceGroups() {
    return this.calculationService.getSpaceGroups().subscribe({
      next: (groups) => {
        let groupsData = groups.reduce((acc, group) => {
          let groupData = acc.find(g => g.id === group.groupId);
          if (!groupData) {
            groupData = {
              id: group.groupId,
              name: group.groupId == 'main-spaces' ? 'Main Spaces' : group.groupId == 'other-spaces' ? 'Other Spaces' : 'Outdoor Spaces',
              types: []
            };
            acc.push(groupData);
          }
          groupData.types.push({
            id: group.id,
            label: group.typeDesc
          });
          return acc;
        }, []);

        this.spaceGroups = groupsData;

        this.loadData(this.calculationId, this.stepId);
      }
    });
  }

  async loadData(calculationId: string, stepId: string) {
    const self = this;
    this.calculationService.getStepData(calculationId, stepId).subscribe({
      next: async (dataObj) => {
        self.data = dataObj;
        if (dataObj){
          self.summary = {};
          self.summary.property = dataObj.property;
          self.summary.general = dataObj.general;
          self.summary.spaces = dataObj.spaces;
          self.summary.kitchens = dataObj.kitchens;
          self.summary.toilets = dataObj.toilets;
          self.summary.additional = dataObj.additional;
        }
      },
      error: (error) => {
        this.toastService.warning('Could not load step data');
        this.router.navigate(['/properties', 'list']);
      }
    });
  }
  
  async saveStep(): Promise<any> {
    const confirmed = await this.confirmationService.confirm({
      title: 'Calculation',
      message: `Are you sure you want to process this calculation?`,
      theme: 'default'
    });
  
    if (confirmed) {
      this.router.navigate(['/calculations', 'calculation'], { state: { calculationId: this.calculationId } });
      return Promise.resolve({ success: true });
    }
  }

  getSpaceTypeName(type: string): string {
    return this.spaceGroups.find(g => g.types.find(t => t.id === type))?.types.find(t => t.id === type)?.label || '';
  }
  
}

