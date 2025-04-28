import { Component, OnInit } from '@angular/core';
import { PeriodsService } from './periods.service';
import { PeriodDto } from './periods.model';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { ConfirmationService } from 'src/app/shared/services/confirmation.service';

@Component({
  selector: 'app-periods',
  templateUrl: './periods.component.html',
  styleUrls: ['./periods.component.scss']
})
export class PeriodsComponent implements OnInit {
  periods: PeriodDto[] = [];
  selectedPeriod: PeriodDto | null = null;
  showModal: boolean = false;

  constructor(
    private periodsService: PeriodsService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadPeriods();
  }

  loadPeriods() {
    this.periodsService.getPeriods().subscribe({
      next: (periods) => this.periods = periods,
      error: () => this.toastService.danger('Could not load periods')
    });
  }

  openCreateModal() {
    this.selectedPeriod = { startDate: '', endDate: '', name: '' };
    this.showModal = true;
  }

  openEditModal(period: PeriodDto) {
    this.selectedPeriod = { ...period };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  savePeriod() {
    if (this.selectedPeriod?.id) {
      this.periodsService.updatePeriod(this.selectedPeriod.id, this.selectedPeriod).subscribe({
        next: () => {
          this.toastService.success('Period updated');
          this.loadPeriods();
          this.showModal = false;
        }
      });
    } else {
      this.periodsService.createPeriod(this.selectedPeriod!).subscribe({
        next: () => {
          this.toastService.success('Period created');
          this.loadPeriods();
          this.showModal = false;
        }
      });
    }
  }

  async deletePeriod(period: PeriodDto) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Delete Period',
      message: 'Are you sure you want to delete this period?',
      theme: 'danger'
    });

    if (confirmed) {
      this.periodsService.deletePeriod(period.id!).subscribe({
        next: () => {
          this.toastService.success('Period deleted');
          this.loadPeriods();
        }
      });
    }
  }
}
