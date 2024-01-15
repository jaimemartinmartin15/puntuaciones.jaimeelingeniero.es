import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Input, QueryList, ViewChildren, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// like in scss file
const CONSTANTS = {
  HOST_ELEMENT_HEIGHT: 109,
  GAP_BETWEEN_DIGITS: 12,
  DIGIT_ELEMENT_HEIGHT: 25,
};

@Component({
  selector: 'app-number-scroller',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './number-scroller.component.html',
  styleUrls: ['./number-scroller.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NumberScrollerComponent), multi: true }],
})
export class NumberScrollerComponent implements AfterViewInit, ControlValueAccessor {
  @ViewChildren('digitScroller')
  public digitScrollableElements: QueryList<ElementRef<HTMLDivElement>>;

  @Input()
  public disabled: boolean = false;

  public digitsOfTheNumber = [0, 0];

  public mouseDragInfo: { isMouseDown: boolean; digitScrollerEl: HTMLDivElement | null; top: number; y: number } = {
    isMouseDown: false,
    digitScrollerEl: null,
    top: CONSTANTS.DIGIT_ELEMENT_HEIGHT + CONSTANTS.GAP_BETWEEN_DIGITS / 2, // current scroll
    y: 0, // current mouse position
  };

  public ngAfterViewInit(): void {
    // center the scroll
    this.digitScrollableElements.map((d) => d.nativeElement.scroll({ top: CONSTANTS.DIGIT_ELEMENT_HEIGHT + CONSTANTS.GAP_BETWEEN_DIGITS / 2 }));
  }

  private getPositionEventY(event: MouseEvent | TouchEvent): number {
    return (event as MouseEvent).clientY ?? (event as TouchEvent).touches[0].clientY;
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  public onMouseDown(event: MouseEvent | TouchEvent) {
    if (!this.disabled) {
      this._onTouch();
      const digitScroller = (event.target as Element).closest('.digitScroller') as HTMLDivElement;
      this.mouseDragInfo.digitScrollerEl = digitScroller;
      this.mouseDragInfo.isMouseDown = true;
      this.mouseDragInfo.top = digitScroller?.scrollTop ?? 0;
      this.mouseDragInfo.y = this.getPositionEventY(event);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  public onMouseMove(event: MouseEvent | TouchEvent) {
    if (this.mouseDragInfo.isMouseDown && this.mouseDragInfo.digitScrollerEl !== null) {
      // How far the mouse has been moved
      const mouseMoveY = this.getPositionEventY(event) - this.mouseDragInfo.y;

      const digitIndex = this.digitScrollableElements
        .toArray()
        .map((e) => e.nativeElement)
        .indexOf(this.mouseDragInfo.digitScrollerEl);

      if (this.mouseDragInfo.digitScrollerEl.scrollTop < CONSTANTS.DIGIT_ELEMENT_HEIGHT / 2) {
        this.digitsOfTheNumber[digitIndex]--;
        if (this.digitsOfTheNumber[digitIndex] < 0) {
          this.digitsOfTheNumber[digitIndex] = 9;
        }
        this._onChange(parseInt(this.digitsOfTheNumber.join('')));
        this.mouseDragInfo.digitScrollerEl.scrollTo({ top: CONSTANTS.DIGIT_ELEMENT_HEIGHT * 1.5 + CONSTANTS.GAP_BETWEEN_DIGITS / 2 });
        this.mouseDragInfo.top = CONSTANTS.DIGIT_ELEMENT_HEIGHT * 1.5 + CONSTANTS.GAP_BETWEEN_DIGITS / 2;
        this.mouseDragInfo.y = this.getPositionEventY(event);
        return;
      } else if (this.mouseDragInfo.digitScrollerEl.scrollTop > CONSTANTS.DIGIT_ELEMENT_HEIGHT * 1.5 + CONSTANTS.GAP_BETWEEN_DIGITS) {
        this.digitsOfTheNumber[digitIndex]++;
        if (this.digitsOfTheNumber[digitIndex] > 9) {
          this.digitsOfTheNumber[digitIndex] = 0;
        }
        this._onChange(parseInt(this.digitsOfTheNumber.join('')));
        this.mouseDragInfo.digitScrollerEl.scrollTo({ top: CONSTANTS.DIGIT_ELEMENT_HEIGHT / 2 + CONSTANTS.GAP_BETWEEN_DIGITS / 2 });
        this.mouseDragInfo.top = CONSTANTS.DIGIT_ELEMENT_HEIGHT / 2 + CONSTANTS.GAP_BETWEEN_DIGITS / 2;
        this.mouseDragInfo.y = this.getPositionEventY(event);
        return;
      }

      // scroll the element
      this.mouseDragInfo.digitScrollerEl.scrollTop = this.mouseDragInfo.top - mouseMoveY;
    }
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  public onMouseUp() {
    if (this.mouseDragInfo.digitScrollerEl !== null) {
      this.mouseDragInfo.digitScrollerEl.scrollTo({ top: CONSTANTS.DIGIT_ELEMENT_HEIGHT + CONSTANTS.GAP_BETWEEN_DIGITS / 2 });
    }

    this.mouseDragInfo.isMouseDown = false;
    this.mouseDragInfo.digitScrollerEl = null;
  }

  /********************* View *********************/

  public trackByDigit(i: number) {
    return i;
  }

  public twoPositionsBefore(n: number): number {
    if (n == 0) return 8;
    if (n == 1) return 9;
    return n - 2;
  }

  public onePositionBefore(n: number): number {
    if (n == 0) return 9;
    return n - 1;
  }

  public onePositionAfter(n: number): number {
    if (n == 9) return 0;
    return n + 1;
  }

  public twoPositionsAfter(n: number): number {
    if (n == 8) return 0;
    if (n == 9) return 1;
    return n + 2;
  }

  /********************* ControlValueAccesor *********************/

  private _onChange: any = () => {};
  private _onTouch: any = () => {};

  public writeValue(digits: number[]): void {
    this.digitsOfTheNumber = digits ?? this.digitsOfTheNumber;
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
