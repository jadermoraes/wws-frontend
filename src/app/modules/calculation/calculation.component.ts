import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalculationService } from './calculation.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrl: './calculation.component.scss'
})
export class CalculationComponent implements OnInit {

  calculationId: string = '';
  calculationInProgress: boolean = false;

  

  constructor(private route: ActivatedRoute,
    private calculationService: CalculationService,
    private toastService: ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.calculationId = state?.calculationId;
    
    if (this.calculationId) {
      this.startCalculation(this.calculationId);
    } else {
      this.toastService.danger('Calculation ID is missing.');
      this.router.navigate(['/properties', 'list']);
      return;
    }
  }


  startCalculation(calculationId: string) {
    this.calculationInProgress = true;
    // this.calculationService.startCalculation(calculationId).subscribe({
    //   next: (response) => {
    //     this.toastService.success('Calculation started successfully.');
    //     this.router.navigate(['/calculations', calculationId, 'steps']);
    //   },
    //   error: (error) => {
    //     this.toastService.danger('Failed to start calculation.');
    //   },
    //   complete: () => {
    //     setTimeout(() => {
    //       this.calculationInProgress = false;
    //     }, 10000);
    //   }
    // });

    setTimeout(() => {
      this.calculationInProgress = false;
    }, 30000);
  }
}
