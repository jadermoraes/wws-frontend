import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ImageCropperComponent } from '../image-cropper/image-cropper.component';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent {
  @ViewChild(ImageCropperComponent) cropperComponent!: ImageCropperComponent;

  @Output() onGetPicture = new EventEmitter<string | null>();
  
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  selectText: string = 'Select';
  cancelText: string = 'Cancel';

  file: string = '';

  isModalOpen = false;
  selectedImage: string;

  onFileChange(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      const _file = URL.createObjectURL(files[0]);
      console.log(files[0])
      this.resetInput();
      this.openAvatarEditor(_file)
    }
  }

  openAvatarEditor(image: string) {
    this.selectedImage = image; // Set the image dynamically
    this.isModalOpen = true;
  }

  openCropper() {
    this.selectedImage = 'path/to/image.jpg'; // Set the image dynamically
    this.isModalOpen = true;
  }
  
  handleCroppedImage(croppedImage: string | null) {
    if (croppedImage) {
        this.file = croppedImage || '';
    }
    this.isModalOpen = false;

    this.onGetPicture.emit(croppedImage || null);

    
  }

  resetInput(){
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if(input){
      input.value = "";
    }
 }

 openModal() {
    this.isModalOpen = true;
  }

  onModalClose() {
    console.log('onModalClose');
    this.isModalOpen = false;
    this.onGetPicture.emit(null);
  }

  onModalConfirm() {
    this.isModalOpen = false;
  }

  onCropperClose(croppedImage: string | null) {
    this.isModalOpen = false;
  }

  triggerCrop() {
    if (this.cropperComponent) {
      this.cropperComponent.crop();
    }
  }
}
