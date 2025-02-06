import { Component, Input, OnInit } from '@angular/core';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'wws-upload-file',
  templateUrl: 'upload-file.component.html',
  styleUrls: ['upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  @Input() files: File[];

  @Input() multiple: boolean = true;

  @Input() allowedFileTypes: string = "*";

  constructor(
    private toastService: ToastService
  ) { }

  ngOnInit() { }

  uploadFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      if (!this.multiple && this.files.length >= 1) {
        this.toastService.danger("Only 1 file allowed");
        break;
      }
      this.files.push(element);
    }
  }

  deleteAttachment(index) {
    this.files.splice(index, 1);
  }
}
