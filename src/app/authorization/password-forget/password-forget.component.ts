import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordService } from '../services/password.service';

@Component({
  selector: 'app-password-forget',
  templateUrl: './password-forget.component.html',
  styleUrls: ['./password-forget.component.scss'],
})
export class PasswordForgetComponent implements OnInit {
  email: string;
  loading = false;
  isSubmitDisabled = true;


  constructor(private passwordService: PasswordService, private toastService: ToastService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  checkSubmitDisabled(): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.email === '' || !emailPattern.test(this.email);
  }

  submitNewPasswordReset() {
    this.loading = true;
    this.passwordService.requestPasswordReset(this.email).subscribe({
      next: (data: any) => {
        this.toastService.success(data.message);
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 500);
      },
      error: (error: any) => {
        this.toastService.danger(error.message);
        this.loading = false;
      }
    });
  }
}
