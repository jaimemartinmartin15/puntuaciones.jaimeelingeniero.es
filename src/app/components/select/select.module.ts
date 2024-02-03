import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SelectOptionComponent } from './select-option/select-option.component';
import { SelectComponent } from './select.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SelectComponent, SelectOptionComponent],
  exports: [SelectComponent, SelectOptionComponent],
})
export class SelectModule {}
