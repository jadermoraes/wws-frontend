import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-validate-email',
  templateUrl: './validate-email.component.html',
  styleUrls: ['./validate-email.component.scss'],
})
export class ValidateEmailComponent implements OnInit {

  passCode: string;
  passcodeError: boolean = false;
  isSubmitDisabled = true;
  loading = false;
  resend = false;


  constructor(private sessionService: SessionService, private toastService: ToastService, router: Router, private route: ActivatedRoute) {
    this.resend = (this.route.snapshot.queryParamMap.get('resend') === 'true'); // Read 'myParam' from the URL
    this.passCode = '';
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      router.navigate(['/login']);
    }
  }

  ngOnInit(): void {}


  validateUser() {
    this.loading = true;
    this.passcodeError = false;

    this.sessionService.validateUser(this.passCode).subscribe({
      next: (data: any) => {
        if (data.result) {
          this.toastService.success(data.message);
          if (data.token) {
            this.sessionService.validateLogin(data.token);
          }
          this.loading = false;
          return;
        } else {
          this.passcodeError = true;
          this.toastService.danger(data.message);
        }
      },
      error: (error: any) => {
        this.toastService.danger(error.message);
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

  onCodeCompleted(code: string) {
    this.passCode = code;
    this.isSubmitDisabled = false;
  }


  requestVerificationCode() {
    this.loading = true;
    this.sessionService.resendVerificationCode().subscribe({
      next: (data: any) => {
        this.toastService.success(data.message);
        this.loading = false;
        this.resend = false;
      },
      error: (error: any) => {
        this.toastService.danger(error.message);
        this.loading = false;
      }
    });
  }
}
