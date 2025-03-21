import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FooterAction } from '../steps-footer/steps-footer.component';
import { ConfirmationService } from 'src/app/shared/services/confirmation.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit {
  basePath: string = ''; // Base path for navigation
  currentStepIndex = 0;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) {}

  steps = [
    { label: 'General', completed: false, enabled: true, href: 'general' },
    { label: 'Spaces', completed: false, enabled: true, href: 'spaces' },
    { label: 'Kitchen', completed: false, enabled: false, href: 'review' },
    { label: 'Plumbing', completed: false, enabled: true, href: 'summary' },
    { label: 'Additional', completed: false, enabled: false, href: 'approval' },
    // { label: 'Confirmation', completed: false, enabled: true, href: 'confirmation' },
    { label: 'Summary', completed: false, enabled: false, href: 'finish' }
  ];

  footerActions: FooterAction[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.basePath = `calculations/${id}/steps`;

    // Auto-navigate to the first enabled step
    this.navigateToStep(0);
  }

  getFullHref(stepHref: string): string {
    return `${this.basePath}/${stepHref}`;
  }

  navigateToStep(index: number): void {
    // if (!this.steps[index].enabled) return; // Prevent navigation to disabled steps

    // Update step completion status
    if (index > this.currentStepIndex) {
      this.steps[this.currentStepIndex].completed = true;
    } else {
      this.steps[index].completed = false; // If moving back, mark as incomplete
    }

    this.currentStepIndex = index;
    this.updateFooterActions();
    const fullPath = this.getFullHref(this.steps[index].href);
    this.router.navigate([fullPath]);
  }

  updateFooterActions(): void {
    this.footerActions = [
      { label: 'Cancel', type: 'warning', position: 'left', width: '100px', action: this.onCancel.bind(this), hidden: this.currentStepIndex > 0 },
      { label: 'Back', type: 'secondary', position: 'left', width: '100px', action: this.onBack.bind(this), hidden: this.currentStepIndex === 0 },
      { label: 'Next', type: 'primary', position: 'right', width: '100px', action: this.onNext.bind(this), disabled: this.currentStepIndex === this.steps.length - 1 },
      { label: 'Finish', type: 'success', position: 'right', width: '100px', action: this.onFinish.bind(this), hidden: this.currentStepIndex !== this.steps.length - 1 }
    ];
  }

  onBack(): void {
    if (this.currentStepIndex > 0) {
      this.navigateToStep(this.currentStepIndex - 1);
    }
  }

  onNext(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.navigateToStep(this.currentStepIndex + 1);
    }
  }

  onFinish(): void {
    console.log('Finish clicked');
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
}
