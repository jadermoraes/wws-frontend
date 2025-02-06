import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordService } from '../services/password.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent implements OnInit {
  token: string;
  email: string;
  password: string;
  confirmPassword: string;
  loading = false;
  isValid = false;
  passwordError = '';
  passwordMismatch: boolean = false;
  isSubmitDisabled = true;


  constructor(private passwordService: PasswordService, private toastService: ToastService, private router: Router, private route: ActivatedRoute) {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.email = this.route.snapshot.queryParamMap.get('email');
    if (!this.token || !this.email) {
      router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
      this.verifyToken();
  }

  verifyToken(): void {
    this.loading = true;
    this.passwordService.verifyToken(this.token, this.email).subscribe({
      next: (data: any) => {
        if (data.result) {
          this.isValid = true;
          this.loading = false;
        } else {
          this.toastService.danger(data.message);
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 500);
        }
      },
      error: (error: any) => {
        this.toastService.danger(error.message);
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 500);
      }
    });
  }

  validatePasswords() {
    const minLength = 8;
    const hasNumber = /\d/.test(this.password);
    const hasSpecialChar = /[!@#$%^&*]/.test(this.password);

    // Validate password strength
    if (this.password.length < minLength) {
      this.passwordError = 'Password must be at least 8 characters long.';
    } else if (!hasNumber || !hasSpecialChar) {
      this.passwordError = 'Password must include at least one number and one special character.';
    } else {
      this.passwordError = '';
    }

    // Check if passwords match
    this.passwordMismatch = this.password !== this.confirmPassword;

    // Disable submit button if there are errors
    this.isSubmitDisabled = !!this.passwordError || this.passwordMismatch || !this.password || !this.confirmPassword;
  }

  submitPasswordReset() {
    if (this.isSubmitDisabled) return;

    this.loading = true;
    this.passwordService.resetPassword(this.token, this.email, this.password).subscribe({
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

  togglePasswordVisibility(inputId: string) {
    const input = document.getElementById(inputId) as HTMLInputElement;
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}
