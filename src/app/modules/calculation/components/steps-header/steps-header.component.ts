import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StepHandlerService } from '../../steps/step-handler.service';
import { EventEmitter, Output } from '@angular/core';
import { ConfirmationService } from 'src/app/shared/services/confirmation.service';

export interface Step {
  id: string;
  label: string;
  completed: boolean;
  enabled: boolean;
  href: string;
}

@Component({
  selector: 'app-steps-header',
  templateUrl: './steps-header.component.html',
  styleUrls: ['./steps-header.component.scss']
})
export class StepsHeaderComponent {
  @Input() steps: Step[] = [];
  @Input() currentStepIndex: number = 0;
  @Output() stepSelected = new EventEmitter<number>();


  constructor(private translate: TranslateService,
    private router: Router,
    private stepHandler: StepHandlerService,
    private confirmationService: ConfirmationService,
  ) { }

  get currentStep(): string {
    return this.steps[this.currentStepIndex]?.label || '';
  }

  goToStep(index: number) {
    if (this.steps[index].enabled && index !== this.currentStepIndex) {
      this.stepSelected.emit(index);
    }
  }
  
  async onExit() {
    const confirmed = await this.confirmationService.confirm({
      title: 'Calculation',
      message: `Do you want to leave this calculation process? All unsaved changes will be lost.`,
    });
  
    if (confirmed) {
      this.router.navigate(['/properties', 'list']);
    }
  }
  
  
}
