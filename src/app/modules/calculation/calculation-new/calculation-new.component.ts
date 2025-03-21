import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CalculationService } from '../calculation.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { ConfirmationService } from 'src/app/shared/services/confirmation.service';

@Component({
  selector: 'app-calculation-new',
  templateUrl: './calculation-new.component.html',
  styleUrls: ['./calculation-new.component.scss']
})
export class CalculationNewComponent {
  propertyId!: string;
  quarterPeriods: {periodId: string, periodName: string}[];
  selectedPeriod: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private calculationService: CalculationService, 
    private toastService: ToastService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.propertyId = this.route.snapshot.paramMap.get('propertyId') || '';
    this.getAvailablePeriods();
  }

  async getAvailablePeriods() {
    await this.calculationService.getPeriods().subscribe(periods => {
      this.quarterPeriods = periods.map(period => ({ periodId: period.periodId, periodName: period.periodName }));
    }, error => {
      this.toastService.danger(error.message); 
    });
  }

  async confirmCalculation() {
    if (this.selectedPeriod) {
      this.calculationService.createCalculation(this.propertyId, this.selectedPeriod).subscribe({
        next: (data) => {
          let calcId = data.id;
          this.router.navigate([`/calculations/${calcId}/steps`]);
        },
        error: (error) => {
          this.toastService.danger(error.message);
        }
      });
    } else {
      this.toastService.danger('Please select a period to proceed');
    }
  }
}
