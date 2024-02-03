import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RadioButtonGroupComponent } from './radio-button-group.component';
import { RadioButtonComponent } from './radio-button/radio-button.component';

@NgModule({
  imports: [CommonModule],
  declarations: [RadioButtonGroupComponent, RadioButtonComponent],
  exports: [RadioButtonGroupComponent, RadioButtonComponent],
})
export class RadioButtonGroupModule {}
