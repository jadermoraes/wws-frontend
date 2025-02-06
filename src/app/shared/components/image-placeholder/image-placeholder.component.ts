import { Component, Input, OnInit } from '@angular/core';
import { Colors, ColorUtils } from '../../utils/color.utils';

@Component({
  selector: 'wws-image-placeholder',
  templateUrl: 'image-placeholder.component.html',
  styleUrls: ['image-placeholder.component.scss']
})
export class ImagePlaceholderComponent implements OnInit {

  @Input()
  size = 32;

  @Input()
  color: string = Colors.PRIMARY;

  @Input()
  label: string;

  bgColor: string;
  sizePx: number;

  ngOnInit() {
    this.bgColor = ColorUtils.opacity(this.color, 0.2);
    this.sizePx = this.size;
  }
}
