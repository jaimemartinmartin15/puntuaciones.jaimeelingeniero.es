import { Component } from '@angular/core';

@Component({
  selector: 'app-radio-button-group',
  template: '<ng-content></ng-content>',
  styles: [':host{ display: block; }'],
})
export class RadioButtonGroupComponent {}
