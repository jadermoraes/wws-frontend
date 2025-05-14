import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Property } from 'src/app/shared/interfaces/property';
import { PropertyService } from '../property.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { GoogleMapsService } from 'src/app/shared/services/google-maps.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { TableData } from 'src/app/shared/interfaces/tableData';
import { CalculationService } from '../../calculation/calculation.service';
import { ConfirmationService } from 'src/app/shared/services/confirmation.service';

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
  latitude: number | null = null;
  longitude: number | null = null;
  mapsModal: boolean = false;
  addressForModal: string = '';
  propertyPicture: string = '';
  refName: string = '';
  calculations: TableData = null;
  allowNewCalculation: boolean = false;

  constructor(private route: ActivatedRoute, 
    private toastService: ToastService,
    private translate: TranslateService, 
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private calculationService: CalculationService,
    private router: Router,
    private imageCompress: NgxImageCompressService,
    private confirmationService: ConfirmationService,
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
      this.propertyForm.patchValue(propertyData);
      if (propertyData.picture) {
        this.propertyPicture = propertyData.picture;
      }
      this.addressForModal = this.getfullAddress();
      this.refName = propertyData.reference;

        this.calculationService.getCalculations(this.propertyId).subscribe((data) => {
          this.calculations = data;
          this.allowNewCalculation = (data.rows.length === 0 || 
            (data.rows.find((row: any) => row.status === 'in-progress') === undefined));
        });
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
      this.addressForModal = this.getfullAddress();
      console.log(this.addressForModal);
      this.openGoogleMapModal();
    } else {
      this.propertyForm.markAllAsTouched();
    }
  }

  openGoogleMapModal() {
    this.mapsModal = true;
  }

  closeModal(): void {
    this.mapsModal = false
  }

  async saveProperty(imgUrl) {
    const payload = this.getFormattedFormData();
    payload.picture = await this.getPicture(imgUrl);
    this.propertyService.createProperty(payload).subscribe({
      next: (data: any) => {
        this.toastService.success(this.translate.instant('property.saveSuccess'));
        this.closeModal();
        this.router.navigate(['/properties/list']);
      },
      error: (error: any) => {
        console.log(error)
        this.toastService.danger(this.translate.instant('property.saveError'));
        this.closeModal();
      }
    });
  }

  downloadImage(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
        })
        .catch(reject);
    });
  }
  

  async getPicture(url: string | undefined): Promise<any> {
    let picture = await this.downloadImage(url);
    if (!picture) {
      return null;
    }
    return await this.imageCompress.compressFile(picture, -1, 50, 50);
  }

  onReset(): void {
    this.propertyForm.reset();
  }

  hasError(field: string, error: string): boolean {
    return this.propertyForm.get(field)?.hasError(error) && this.propertyForm.get(field)?.touched;
  }

  getfullAddress(): string {
    return `${this.propertyForm.value.streetName}, ${this.propertyForm.value.propertyNumber} -  ${this.propertyForm.value.place}`;
  }

  async newCalculation() {
      const confirmed = await this.confirmationService.confirm({
        title: 'New Calculation',
        message: `Do you want to create a new calculation for this property?`,
      });
    
      if (confirmed) {
        this.router.navigate([`/calculations/${this.propertyId}/new`]);
      }
  }

  async resumeCalculation(calcId: string) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Calculation',
      message: `Do you want to resume this calculation process?`,
    });
  
    if (confirmed) {
      this.router.navigate([`/calculations/${calcId}/steps`]);
    }
  }

  async viewCalculation(calcId: string) {
    this.router.navigate([`/calculations/${calcId}/overview`]);
  }

  getAddress = () => {
    if (!this.propertyForm.value.zipCode || !this.propertyForm.value.propertyNumber) {
      return;
    }

    this.propertyForm.disable();

    this.propertyService.getAddress(this.propertyForm.value.zipCode, this.propertyForm.value.propertyNumber).subscribe({next: (data) => {
      if (data && data.status === 'ok') {
        let bag = data.bag[0];

        if (bag) {
          this.propertyForm.patchValue({
            streetName: bag.street,
            propertyLetter: bag.letter,
            place: bag.city
          });
        }    
      }
    }, error: (error) => {
      this.toastService.danger('Error fetching address information');
      this.propertyForm.enable();
    }, complete: () => {
      this.propertyForm.enable();
    }});
  }
  
}
