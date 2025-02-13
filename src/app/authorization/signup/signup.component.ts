import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { SessionService } from '../services/session.service';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  picture: string | undefined;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private sessionService: SessionService,
    private translate: TranslateService,
    private imageCompress: NgxImageCompressService
  ) {
    this.signupForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        role: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$'),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordsMatchValidator }
    );
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {});
  }

  async submitForm() {
    if (this.signupForm.invalid) {
      this.toastService.warning(this.translate.instant('messages.form.invalid'));
      return;
    }

    const profilePicture = await this.getProfilePicture(this.picture);
    const newUser = { ...this.signupForm.value };
    if (profilePicture) {
      newUser.profilePicture = profilePicture;
    }

    this.sessionService.signup(newUser).subscribe({
      next: () => {
        this.toastService.success(this.translate.instant('messages.user.created'));
        this.sessionService.redirectToLogin();
      },
      error: (error) => {
        this.toastService.danger(error.error.message);
      },
    });
  }

  onGetPicture(base64Pic: string) {
    this.picture = base64Pic;
  }

  async getProfilePicture(picture: string | undefined): Promise<any> {
    return picture ? this.imageCompress.compressFile(picture, -1, 50, 50) : null;
  }

  // Custom validator for password match
  passwordsMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      control.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }
}
