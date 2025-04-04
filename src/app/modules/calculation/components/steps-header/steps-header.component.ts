import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StepHandlerService } from '../../steps/step-handler.service';

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

  constructor(private translate: TranslateService,
    private router: Router,
    private stepHandler: StepHandlerService
  ) { }

  get currentStep(): string {
    return this.steps[this.currentStepIndex]?.label || '';
  }

  goToStep(index: number) {
    if (this.steps[index].enabled) {
      if (index !== this.currentStepIndex) {
        this.currentStepIndex = index;

        const currentUrl = this.router.url.split('/');
        currentUrl[currentUrl.length - 1] = this.steps[index].href;
        this.router.navigate([currentUrl.join('/')], { state: { stepId: this.steps[index].id } });
      }
    }
  }
  
}
