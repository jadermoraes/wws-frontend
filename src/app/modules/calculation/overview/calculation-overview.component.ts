import { Component } from '@angular/core';

@Component({
  selector: 'app-calculation-overview',
  templateUrl: './calculation-overview.component.html',
  styleUrls: ['./calculation-overview.component.scss']
})
export class CalculationOverviewComponent {
  selectedPeriod = {
    label: '01-07-2024 to 31-12-2024',
    createdOn: '08-11-2024 14:17',
    createdBy: 'Jan Jaap Wennekes',
    lastEdited: '05-03-2025 18:36',
    totalPoints: 213,
    maxPrice: '€ 1,332.73',
    currentPrice: '€ 2000'
  };
  
  editPrice() {
    console.log('Edit Price Clicked');
  }
  
  modifyCalculation() {
    console.log('Modify Clicked');
  }
  
  exportPDF() {
    console.log('Export PDF Clicked');
  }
  
  removeCalculation() {
    console.log('Remove Clicked');
  }
  
  addCalculation() {
    console.log('Add Calculation Clicked');
  }
}