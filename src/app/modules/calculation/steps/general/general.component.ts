import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { CalculationService } from '../../calculation.service';
import { ActivatedRoute } from '@angular/router';
import { WozValues } from 'src/app/shared/interfaces/wozValues';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent {
  calculationId: string = '';
  selectedWozValue: string = '';
  wozAmounts: WozValues[] = [];

  constructor(
    private calculationService: CalculationService,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    this.calculationId = this.route.parent?.snapshot.paramMap.get('id') || '';
  }


  loadWozValues(): void {
    this.calculationService.getWozValues(this.calculationId).subscribe((data) => {
      this.wozAmounts = data;
    });
  }
  
}
