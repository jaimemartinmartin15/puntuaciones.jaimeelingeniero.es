import { Component, ContentChildren, ElementRef, HostListener, Input, QueryList, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOptionComponent } from './select-option/select-option.component';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectComponent), multi: true }],
    standalone: false
})
export class SelectComponent implements ControlValueAccessor {
  @ContentChildren(SelectOptionComponent, { read: ElementRef })
  public optionsElementRef: QueryList<ElementRef<HTMLElement>>;

  @ContentChildren(SelectOptionComponent)
  public optionsComponents: QueryList<SelectOptionComponent>;

  @Input()
  public disabled: boolean = false;

  public isDropdownOpen = false;

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent) {
    if (!this.disabled) {
      this.isDropdownOpen = !this.isDropdownOpen;

      const option = (event.target as HTMLElement).closest('app-select-option') as HTMLElement;
      if (option) {
        const selectedIndex = this.optionsElementRef
          .toArray()
          .map((o) => o.nativeElement)
          .indexOf(option);

        this._onTouch();
        this._onChange(this.optionsComponents.toArray()[selectedIndex].value);
      }
    }
  }

  /********************* ControlValueAccesor *********************/

  private _onChange: any = () => {};
  private _onTouch: any = () => {};

  public writeValue(): void {}

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
