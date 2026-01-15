import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  ViewChildren,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface MouseDragInfo {
  isMouseDown: boolean;
  digitScrollerEl: HTMLDivElement | null;
  top: number; // scroll position when dragging starts
  y: number; // initial mouse position when dragging starts
}

// like in scss file
const CONSTANTS = {
  HOST_ELEMENT_HEIGHT: 109,
  GAP_BETWEEN_DIGITS: 12,
  DIGIT_ELEMENT_HEIGHT: 25,
};

@Component({
    selector: 'app-input-number-scroller',
    imports: [CommonModule],
    templateUrl: './input-number-scroller.component.html',
    styleUrls: ['./input-number-scroller.component.scss'],
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputNumberScrollerComponent), multi: true }]
})
export class InputNumberScrollerComponent implements OnChanges, AfterViewInit, ControlValueAccessor {
  @ViewChildren('digitScroller')
  public digitScrollableElements: QueryList<ElementRef<HTMLDivElement>>;

  @Input()
  public disabled: boolean = false;

  @Input()
  public numberOfScrollers: number = 2;
  public digits: number[] = [0, 0];

  private mouseDragInfo: MouseDragInfo = { isMouseDown: false, digitScrollerEl: null, top: 0, y: 0 };

  public ngOnChanges(changes: SimpleChanges): void {
    if ('numberOfScrollers' in changes) {
      this.digits.reverse();
      this.digits.length = changes['numberOfScrollers'].currentValue;
      this.digits.reverse();
      for (let i = 0; i < this.numberOfScrollers; i++) {
        this.digits[i] = this.digits[i] ?? 0;
      }

      // wait to show all digit scrollers and center them
      setTimeout(() => this.centerDigitScrollers());
    }
  }

  public ngAfterViewInit(): void {
    this.centerDigitScrollers();
  }

  private centerDigitScrollers() {
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
        this.digits[digitIndex]--;
        if (this.digits[digitIndex] < 0) {
          this.digits[digitIndex] = 9;
        }
        this._onChange(parseInt(this.digits.join('')));
        this.mouseDragInfo.digitScrollerEl.scrollTo({ top: CONSTANTS.DIGIT_ELEMENT_HEIGHT * 1.5 + CONSTANTS.GAP_BETWEEN_DIGITS / 2 });
        this.mouseDragInfo.top = CONSTANTS.DIGIT_ELEMENT_HEIGHT * 1.5 + CONSTANTS.GAP_BETWEEN_DIGITS / 2;
        this.mouseDragInfo.y = this.getPositionEventY(event);
        return;
      } else if (this.mouseDragInfo.digitScrollerEl.scrollTop > CONSTANTS.DIGIT_ELEMENT_HEIGHT * 1.5 + CONSTANTS.GAP_BETWEEN_DIGITS) {
        this.digits[digitIndex]++;
        if (this.digits[digitIndex] > 9) {
          this.digits[digitIndex] = 0;
        }
        this._onChange(parseInt(this.digits.join('')));
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

  public writeValue(value: number): void {
    // ngModel writes first null
    if (value !== null) {
      const splitNumber = value
        .toString()
        .split('')
        .map((d) => parseInt(d));
      for (let i = 0; i < this.numberOfScrollers; i++) {
        this.digits[this.numberOfScrollers - 1 - i] = splitNumber[splitNumber.length - 1 - i] ?? 0;
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
