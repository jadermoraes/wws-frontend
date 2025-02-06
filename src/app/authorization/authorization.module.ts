import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from './signup/signup.component';
import { TranslateModule } from "@ngx-translate/core";
import { LogoutComponent } from "./logout/logout.component";
import { SharedModule } from "../shared/shared.module";
import { ValidateOTPComponent } from "./validate/otp/validate-otp.component";
import { CodeInputModule } from "angular-code-input";
import { ValidateEmailComponent } from "./validate/email/validate-email.component";
import { PasswordResetComponent } from "./password-reset/password-reset.component";
import { PasswordForgetComponent } from "./password-forget/password-forget.component";

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        TranslateModule,
        SharedModule,
        CodeInputModule,
    ],
    exports: [
        LoginComponent
    ],
    declarations: [
        LoginComponent,
        SignupComponent,
        LogoutComponent,
        ValidateOTPComponent,
        ValidateEmailComponent,
        PasswordResetComponent,
        PasswordForgetComponent
    ],
    providers: []
})
export class AuthorizationModule {}
