import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import Cropper from 'cropperjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
})
export class ImageCropperComponent implements OnChanges {
  @Input() image: string;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<string | null>();

  cropper!: Cropper;
  sanitizedUrl: any;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.image);
      setTimeout(() => this.initCropper(), 0); // Allow the DOM to render the image
    } else if (changes['isOpen'] && !this.isOpen) {
      this.destroyCropper();
    }
  }

  initCropper() {
    const image = document.getElementById('image') as HTMLImageElement;
    this.cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 1,
      guides: false,
      scalable: true,
      zoomable: true,
      autoCropArea: 0.8, // Crops 80% of the container initially
      responsive: true, // Makes the cropper adjust to container size
    });
  }
  

  destroyCropper() {
    if (this.cropper) {
      this.cropper.destroy();
    }
  }

  getRoundedCanvas(sourceCanvas: any) {
    const canvas = document.createElement('canvas');
    const context: any = canvas.getContext('2d');
    const width = sourceCanvas.width;
    const height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(
      width / 2,
      height / 2,
      Math.min(width, height) / 2,
      0,
      2 * Math.PI,
      true
    );
    context.fill();
    return canvas;
  }

  crop() {
    const croppedCanvas = this.cropper.getCroppedCanvas();
    const roundedCanvas = this.getRoundedCanvas(croppedCanvas);

    if (roundedCanvas) {
      this.close.emit(roundedCanvas.toDataURL());
    } else {
      this.close.emit(null);
    }
    this.isOpen = false;
  }

  reset() {
    if (this.cropper) {
      this.cropper.clear();
      this.cropper.crop();
    }
  }

  closeModal() {
    this.close.emit(null);
    this.isOpen = false;
  }
}
