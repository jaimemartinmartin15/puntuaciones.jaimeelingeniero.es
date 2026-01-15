import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-select-option',
    template: '<ng-content></ng-content>',
    styleUrls: ['./select-option.component.scss'],
    standalone: false
})
export class SelectOptionComponent {
  @Input()
  public value: any;
}
