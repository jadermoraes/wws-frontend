import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Property } from 'src/app/shared/interfaces/property';
import { PropertyService } from '../property.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';

@Component({
  selector: 'wws-property',
  templateUrl: './property.component.html',
  styleUrl: './property.component.scss'
})
export class PropertyComponent implements OnInit {
  propertyId: string = '';
  isNew: boolean = false;
  propertyForm!: FormGroup;
  isFormValid: boolean = true;

  constructor(private route: ActivatedRoute, 
    private toastService: ToastService,
    private translate: TranslateService, 
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private router: Router
  ) { }

  ngOnInit() {
    this.propertyForm = this.fb.group({
      zipCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      propertyNumber: [null, [Validators.required, Validators.min(1), Validators.max(99999), Validators.pattern(/^\d+$/)]],
      propertyLetter: ['', [Validators.maxLength(1)]],
      propertyNumberAddition: ['', [Validators.maxLength(1)]],
      streetName: ['', [Validators.required, Validators.minLength(3)]],
      place: ['', [Validators.required, Validators.minLength(2)]],
      currentRent: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]], // Accepts numbers with up to 2 decimals
      reference: ['', [Validators.maxLength(100)]]
    });

    this.propertyId = this.route.snapshot.paramMap.get('id');

    this.isNew = this.propertyId == 'create';

    if (!this.isNew) {
      this.loadPropertyData();
    }
  }

  async loadPropertyData() {
    this.propertyService.getProperty(this.propertyId).subscribe( propertyData => {
      console.log(propertyData);

      this.propertyForm.patchValue(propertyData);
    });

    
  }

  getFormattedFormData(): any {
    return {
      ...this.propertyForm.value,
      currentRent: Number(this.propertyForm.value.currentRent)
    };
  }
  

  onSave(): void {
    if (this.propertyForm.valid) {
      const payload = this.getFormattedFormData();
      this.propertyService.createProperty(payload).subscribe(
        (property: Property) => {
          this.toastService.success(this.translate.instant('property.saveSuccess'));
          this.router.navigate(['/properties/property', property.id]);
        }, 
        error => {
          console.log(error)
          this.toastService.danger(this.translate.instant('property.saveError'));
        }
      );
    } else {
      this.propertyForm.markAllAsTouched();
    }
  }

  onReset(): void {
    this.propertyForm.reset();
  }

  hasError(field: string, error: string): boolean {
    return this.propertyForm.get(field)?.hasError(error) && this.propertyForm.get(field)?.touched;
  }
  
}
