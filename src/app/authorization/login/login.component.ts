import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  error?: string;

  constructor(private sessionService: SessionService, private toastService: ToastService) {
    this.email = '';
    this.password = '';
  }

  ngOnInit(): void {}

  resetPassword() {
    // this.sessionService.redirectToResetPassword();
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      this.toastService.warning('Invalid User/Password');
      return;
    }

    this.sessionService.clearSession();
    this.sessionService.login(this.toastService, email, password);
  }
}
