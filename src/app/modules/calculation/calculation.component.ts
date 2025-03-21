import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrl: './calculation.component.scss'
})
export class CalculationComponent {
  mode: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(data => {
      this.mode = data['mode'];
    });
  }
}
