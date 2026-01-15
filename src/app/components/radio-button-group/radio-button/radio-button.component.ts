import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'app-radio-button',
    templateUrl: './radio-button.component.html',
    styleUrls: ['./radio-button.component.scss'],
    standalone: false
})
export class RadioButtonComponent {
  @Input()
  public value: any;

  @Input()
  @HostBinding('class.disabled')
  public disabled: boolean = false;

  public selected: boolean = false;
}
