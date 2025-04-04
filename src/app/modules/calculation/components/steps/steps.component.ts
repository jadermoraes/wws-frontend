import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FooterAction } from '../steps-footer/steps-footer.component';
import { ConfirmationService } from 'src/app/shared/services/confirmation.service';
import { StepHandlerService } from '../../steps/step-handler.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { CalculationService } from '../../calculation.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit {
  basePath: string = ''; // Base path for navigation
  currentStepIndex = 0;
  isSavingStep = false;
  calculationId = null;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private stepHandler: StepHandlerService,
    private toastService: ToastService,
    private calculationService: CalculationService
  ) {}

  steps = [];

  footerActions: FooterAction[] = [];

  async ngOnInit() {
    this.calculationId = this.route.snapshot.paramMap.get('id');
    await this.loadStepsAndNavigate();
    this.basePath = `calculations/${this.calculationId}/steps`;
  }


  loadStepsAndNavigate(): void {
    this.calculationService.getSteps(this.calculationId).subscribe( {
      next: (steps) => {
        this.steps = steps
          .map((step: any) => {
            return {
              id: step.id,
              name: step.name,
              label: step.description,
              completed: step.completed,
              enabled: step.enabled,
              status: step.status,
              href: step.href,
              order: step.order
            };
          })
          .sort((a, b) => a.order - b.order);

        let targetStepIndex = this.steps.findIndex(step => step.enabled && !step.completed);

        if (targetStepIndex === -1 && this.steps.every(step => step.completed)) {
          targetStepIndex = this.steps.length - 1;
        }

        if (targetStepIndex !== -1) {
          this.navigateToStep(targetStepIndex);
        }
      },
      error: (error) => {
        this.toastService.danger('Could not load steps');
        this.router.navigate(['/properties', 'list']);
      }
    });
  }

  getFullHref(stepHref: string): string {
    return `${this.basePath}/${stepHref}`;
  }

  navigateToStep(index: number): void {
    this.currentStepIndex = index;
    this.updateFooterActions();
    const fullPath = this.getFullHref(this.steps[index].href);
    this.router.navigate([fullPath], { state: { stepId: this.steps[this.currentStepIndex].id } });
  }

  updateFooterActions(): void {
    this.footerActions = [
      { label: 'Cancel', type: 'warning', position: 'left', width: '100px', action: this.onCancel.bind(this), hidden: this.currentStepIndex > 0 },
      { label: 'Back', type: 'secondary', position: 'left', width: '100px', action: this.onBack.bind(this), hidden: this.currentStepIndex === 0 },
      { label: 'Next', type: 'primary', position: 'right', width: '100px', action: this.onNext.bind(this), disabled: this.currentStepIndex === this.steps.length - 1 },
      { label: 'Calculate', type: 'success', position: 'right', width: '150px', action: this.onCalculate.bind(this), hidden: this.currentStepIndex !== this.steps.length - 1 }
    ];
  }

  onBack(): void {
    if (this.currentStepIndex > 0) {
      this.navigateToStep(this.currentStepIndex - 1);
    }
  }

  async onNext() {
    this.setProcessing(true)
    try{
      const validation = await this.stepHandler.triggerSave();
      if (validation.success) {
        this.loadStepsAndNavigate();
      }
    } catch (error) {
      this.toastService.danger('Could not save step');
    } finally {
      this.setProcessing(false);
    }
  }

  goToNextStep(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.navigateToStep(this.currentStepIndex + 1);
    }
  }

  onCalculate(): void {
    this.setProcessing(true)
    try{
      this.stepHandler.triggerSave();
    } catch (error) {
      this.toastService.danger('Could not save step');
    } finally {
      this.setProcessing(false);
    }
  }

  async onCancel() {  
    const confirmed = await this.confirmationService.confirm({
      title: 'Calculation',
      message: `Are you sure you want to cancel this calculation? 
      All unsaved changes will be lost.`,
      theme: 'danger'
    });
  
    if (confirmed) {
      this.router.navigate(['/properties', 'list']);
    }
  }

  setProcessing(processing: boolean): void {
    this.footerActions = this.footerActions.map(action => {
      if (action.label === 'Next') {
        action.disabled = processing;
      }
      return action;
    });

    this.isSavingStep = processing;
  }
}
