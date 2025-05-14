import { Component, OnInit } from '@angular/core';
import { CalculationService } from '../calculation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { ConfirmationService } from 'src/app/shared/services/confirmation.service';
import { TableData } from 'src/app/shared/interfaces/tableData';

@Component({
  selector: 'app-calculation-overview',
  templateUrl: './calculation-overview.component.html',
  styleUrls: ['./calculation-overview.component.scss']
})
export class CalculationOverviewComponent implements OnInit {
  data = null;
  calculationId: string = '';
  logs: any = null;


  constructor(private route: ActivatedRoute,
      private calculationService: CalculationService,
      private toastService: ToastService,
      private confirmationService: ConfirmationService,
      private router: Router,
    ) {}
  
  ngOnInit(): void {
    this.calculationId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.calculationId) {
      this.loadData(this.calculationId);
    } else {
      this.toastService.danger('Calculation ID is missing.');
      this.router.navigate(['/properties', 'list']);
      return;
    }
  }

  loadData(calculationId: string) {
    this.calculationService.getCalculationOverview(calculationId).subscribe({
      next: (data) => {
        if (data.success && data.result) {
          this.data = data.result;
        }
      }
    });

    this.calculationService.getCalculationLogs(calculationId).subscribe({
      next: (data) => {
        if (data.success && data.result) {
          this.logs = data.result;
        }
      }
    });
  }
  
  editPrice() {
    console.log('Edit Price Clicked');
  }
  
  async modifyCalculation() {
    const confirmed = await this.confirmationService.confirm({
      title: 'Calculation',
      message: `Are you sure you want to edit this calculation steps?`,
      theme: 'default'
    });
  
    if (confirmed) {
      this.router.navigate([`/calculations/${this.calculationId}/steps`]);
    }
  }
  
  exportPDF() {
    console.log('Export PDF Clicked');
  }
  
  exitPage() {
    this.router.navigate(['/properties', 'list']);
  }
  
  async addCalculation() {
    const confirmed = await this.confirmationService.confirm({
      title: 'Calculation',
      message: `Are you sure you want to create a new Calculation?`,
      theme: 'default'
    });
  
    if (confirmed) {
      let property = this.data.propertyId;
      this.router.navigate([`/calculations/${property}/new`]);
    }
  }

  get spacesLogs() {
    return this.logs?.filter(l => l.logType === 'spaces') || [];
  }
  
  get additionalLogs() {
    return this.logs?.filter(l => l.logType === 'additional') || [];
  }
  
  get wozLogs() {
    return this.logs?.filter(l => l.logType === 'woz') || [];
  }
  
  get totalLog() {
    return this.logs?.find(l => l.logType === 'total');
  }

  get energyLogs() {    
    return this.logs?.filter(l => l.logType === 'energy');
  }
  
}