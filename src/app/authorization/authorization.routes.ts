import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { unauthorizedGuard } from "./guards/unauthorized.guard";
import { authorizationGuard } from "./guards/authorization.guard";
import { LogoutComponent } from "./logout/logout.component";
import { ValidateOTPComponent } from "./validate/otp/validate-otp.component";
import { ValidateEmailComponent } from "./validate/email/validate-email.component";
import { PasswordResetComponent } from "./password-reset/password-reset.component";
import { PasswordForgetComponent } from "./password-forget/password-forget.component";

export const authorizationRoutes: Routes = [
    { path: 'login', canActivate: [unauthorizedGuard], component: LoginComponent, data: { breadcrumb: 'Login' } },
    { path: 'signup', canActivate: [unauthorizedGuard], component: SignupComponent, data: { breadcrumb: 'SignUp' } },
    { path: 'logout', canActivate: [authorizationGuard], component: LogoutComponent, data: { breadcrumb: 'Logout' } },
    { path: 'reset-password', canActivate: [unauthorizedGuard], component: PasswordResetComponent, data: { breadcrumb: 'PasswordReset' } },
    { path: 'forgot-password', canActivate: [unauthorizedGuard], component: PasswordForgetComponent, data: { breadcrumb: 'PasswordForget' } },
    { path: 'validate', canActivate: [unauthorizedGuard],
      children: [ 
        { path: 'otp', canActivate: [unauthorizedGuard], component: ValidateOTPComponent, data: { breadcrumb: 'OTP' } },
        { path: 'email', canActivate: [unauthorizedGuard], component: ValidateEmailComponent, data: { breadcrumb: 'Email' } },
      ]
    },
  ];
