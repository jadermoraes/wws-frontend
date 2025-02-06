import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-validate-otp',
  templateUrl: './validate-otp.component.html',
  styleUrls: ['./validate-otp.component.scss'],
})
export class ValidateOTPComponent implements OnInit {
  passCode: string;

  //require logic
  url: string;
  createOtp: boolean = false;
  isLoading = false;
  qrCode: string | null;
  rememberMe: boolean = false;

  //validate logic
  loading: boolean = false;
  passcodeError: boolean = false;
  isSubmitDisabled = true;


  constructor(private sessionService: SessionService, private toastService: ToastService, router: Router) {
    this.passCode = '';
    this.url = '';
    this.createOtp = localStorage.getItem('createOtp') === 'true';
    let sessionId = localStorage.getItem('sessionId');

    if (!sessionId) {
      router.navigate(['/login']);
    }
  }

  ngOnInit(): void {}


  // validateOtp(): void {
  //   if (this.passCode.length === 6) {
  //     console.log('Validating OTP:', this.passCode);
  //     // Add logic to validate the OTP (e.g., API call)
  //   } else {
  //     console.error('Please enter a valid 6-digit OTP');
  //   }
  // }

  requestQrCode() {
    this.isLoading = true;

    this.sessionService.generateUserOTP().subscribe({
      next: (data: any) => {
        console.log('OTP generated successfully:', data);
        this.qrCode = data.qrCode;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error generating OTP:', error);
        this.isLoading = false;
      }
    });
  }

  continueToValidation(){
    localStorage.setItem('createOtp', 'false');
    window.location.reload();
  }

  submitPasscode(): void {
    if (this.passCode.length !== 6) {
      this.passcodeError = true;
      return;
    }

    this.loading = true;
    this.sessionService.validateOtp(this.passCode, this.rememberMe).subscribe({
      next: (data: any) => {
        if (data.token) {
          this.sessionService.validateLogin(data.token);
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error generating OTP:', error);
        this.passcodeError = true;
        this.loading = false;
      }
    });
  }


  onCodeChanged(code: string) {
    this.isSubmitDisabled = code.length !== 6;
    if (code.length === 6) {
      this.passCode = code;
    } else {
      this.passCode = '';
    }
  }

  // this called only if user entered full code
  onCodeCompleted(code: string) {
    this.passCode = code;
    this.isSubmitDisabled = false;
  }
}
