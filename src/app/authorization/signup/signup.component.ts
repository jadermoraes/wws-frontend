import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { SessionService } from '../services/session.service';
import { DataUrl, NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private toastService: ToastService, private sessionService: SessionService, private translate: TranslateService, private imageCompress: NgxImageCompressService) { }

  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  role: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
  picture: string | undefined;

  async submitForm() {
    if (this.password !== this.confirmPassword) {
      this.toastService.warning(this.translate.instant('messages.passwords.dont_match'));
      return;
    }

  
    let profilePicture = await this.getProfilePicture(this.picture);
    let newUser = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      role: this.role,
      password: this.password,
      confirmPassword: this.confirmPassword,
    };

    if (profilePicture) {
      newUser['profilePicture'] = profilePicture;
    }
    
    // Call the API to create a new user
    this.sessionService.signup(newUser).subscribe({
      next: (data: any) => {
        this.toastService.success(this.translate.instant('messages.user.created'));
        this.sessionService.redirectToLogin();
      },
      error: (error: any) => {
        console.log(JSON.stringify(error));
        if (error.status === 400) {
          this.toastService.danger(this.translate.instant('messages.user.not_created' + ': ' + JSON.stringify(error.error.message)));
        } else {
          this.toastService.danger(this.translate.instant('messages.user.not_created'));
        }
      }
    });
  }

  onGetPicture(base64Pic) {
    this.picture = base64Pic;
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe({
      next: async (lang: any) => {
    }});
  }

  async getProfilePicture(picture: string | undefined): Promise<any> {
    if (!picture) {
      return null;
    }
    return await this.imageCompress.compressFile(picture, -1, 50, 50);
  }
}
