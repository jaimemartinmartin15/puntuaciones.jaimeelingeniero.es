import { Component, ContentChildren, ElementRef, HostListener, Input, QueryList, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioButtonComponent } from './radio-button/radio-button.component';

@Component({
  selector: 'app-radio-button-group',
  template: '<ng-content></ng-content>',
  styles: [':host{ display: flex; flex-direction: column; gap: 8px; }'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RadioButtonGroupComponent), multi: true }],
})
export class RadioButtonGroupComponent {
  @ContentChildren(RadioButtonComponent, { read: ElementRef })
  public optionsElementRef: QueryList<ElementRef<HTMLElement>>;

  @ContentChildren(RadioButtonComponent)
  public optionsComponents: QueryList<RadioButtonComponent>;

  @Input()
  public disabled: boolean = false;

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent) {
    if (!this.disabled) {
      const option = (event.target as HTMLElement).closest('app-radio-button') as HTMLElement;
      if (option) {
        this.optionsComponents.forEach((o) => (o.selected = false));
        const selectedIndex = this.optionsElementRef
          .toArray()
          .map((o) => o.nativeElement)
          .indexOf(option);
        const selectedOption = this.optionsComponents.toArray()[selectedIndex];
        selectedOption.selected = true;
        this._onTouch();
        this._onChange(selectedOption.value);
      }
    }
  }

  /********************* ControlValueAccesor *********************/

  private _onChange: any = () => {};
  private _onTouch: any = () => {};

  public writeValue(value: any): void {
    if (this.optionsComponents) {
      this.optionsComponents.forEach((o) => (o.selected = false));
      const selectedOption = this.optionsComponents.find((o) => o.value === value);
      if (selectedOption) {
        selectedOption.selected = true;
      }
    }
  }

  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
