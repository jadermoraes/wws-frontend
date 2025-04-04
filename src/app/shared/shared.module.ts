import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DropdownComponent } from './components/dropdown/dropdown.component';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { IconComponent } from './components/icon/icon.component';
import { ImagePlaceholderComponent } from './components/image-placeholder/image-placeholder.component';
import { LabelComponent } from './components/label/label.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import {
  // TableCellTemplateDirective,
  TableComponent,
} from './components/table/table.component';
import { ToastComponent } from './components/toast/toast.component';
import { BtnDirective } from './directives/btn/btn.directive';
import { ClickOutsideDirective } from './directives/click-outside/click-outside.directive';
import { FormElementDirective } from './directives/form-element/form-element.directive';
import { NumberDirective } from './directives/number/number.directive';
import { PercentageDirective } from './directives/percentage/percentage.directive';
import { SelectDirective } from './directives/select/select.directive';
import { TextDirective } from './directives/text/text.directive';
import { AutoFocusDirective } from './directives/auto-focus/auto-focus.directive';
import { filterPipe } from './pipes/pipes';
import { UploadDirective } from './directives/upload-area/upload-area.directive';
import { ColumnResizeDirective } from './directives/column-resize/column-resize.directive';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { TooltipDirective } from './components/tooltip/tooltip.directive';
import { DropDirective } from './directives/drag-drop/drop.directive';
import { DragDirective } from './directives/drag-drop/drag.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CardComponent } from './components/card/card.component';
import { DateUtcDirective } from './directives/date-utc/date-utc.directive';
import { DateDirective } from './directives/date/date.directive';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { HeaderComponent } from "../components/header/header.component";
import { FooterComponent } from "../components/footer/footer.component";
import { TopbarComponent } from "../components/topbar/topbar.component";
import { SubheaderComponent } from '../components/subheader/subheader.component';
import { ModalComponent } from '../components/modal/modal.component';
import { SidenavComponent } from '../components/sidenav/sidenav.component';
import { SublevelMenuComponent } from '../components/sidenav/sublevel-menu.component';
import { ToggleSwitchComponent } from './components/toggle-switch/toggle-switch.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProfilePictureComponent } from './components/profile-picture/profile-picture.component';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { GoogleMapModalComponent } from './components/google-map-modal/google-map-modal.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { GoogleMapsFrameComponent } from './components/google-maps-frame/google-maps-frame.component';
import { ChipComponent } from './components/chip/chip.component';
import { SelectComponent } from './components/select/select.component';
import { FacilitySelectorComponent } from './components/facility-selector/facility-selector.component';

const COMPONENTS_AND_DIRECTIVES = [
  TextDirective,
  UploadDirective,
  DropDirective,
  DragDirective,
  FormElementDirective,
  BtnDirective,
  LabelComponent,
  IconComponent,
  TableComponent,
  // TableCellTemplateDirective,
  ImagePlaceholderComponent,
  ToastComponent,
  ClickOutsideDirective,
  SelectDirective,
  NumberDirective,
  DropdownComponent,
  DropdownMenuComponent,
  SpinnerComponent,
  PercentageDirective,
  DateDirective,
  DateUtcDirective,
  AutoFocusDirective,
  filterPipe,
  ColumnResizeDirective,
  TooltipDirective,
  TooltipComponent,
  CardComponent,
  UploadDirective,
  UploadFileComponent,
  TopbarComponent,
  SubheaderComponent,
  ModalComponent,
  SidenavComponent,
  SublevelMenuComponent,
  ToggleSwitchComponent,
  ProfilePictureComponent,
  ImageCropperComponent,
  GoogleMapModalComponent,
  ConfirmationComponent,
  GoogleMapsFrameComponent,
  ChipComponent,
  SelectComponent,
  FacilitySelectorComponent,
];

@NgModule({
    declarations: [COMPONENTS_AND_DIRECTIVES],
    exports: [COMPONENTS_AND_DIRECTIVES],
    providers: [DecimalPipe],
    imports: [CommonModule, RouterModule, FormsModule, DragDropModule, HeaderComponent, TranslateModule]
})
export class SharedModule {}
