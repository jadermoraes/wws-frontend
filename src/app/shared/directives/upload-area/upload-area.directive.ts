import { Directive, EventEmitter, Host, HostBinding, HostListener, Output } from '@angular/core';

@Directive({ selector: '[wwsUpload]' })
export class UploadDirective {

  @Output() onFileDropped = new EventEmitter<any>();

  @HostBinding('style.background-color') private background = 'rgb(212 222 242)'
  @HostBinding('style.opacity') private opacity = '1'

  //Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#9ecbec';
    this.opacity = '0.8'
  }

  //Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = 'rgb(212 222 242)'
    this.opacity = '1'
  }

  //Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = 'rgb(212 222 242)'
    this.opacity = '1'
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files)
    }
  }
}
