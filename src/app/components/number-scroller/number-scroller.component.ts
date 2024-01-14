import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-number-scroller',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './number-scroller.component.html',
  styleUrls: ['./number-scroller.component.scss'],
})
export class NumberScrollerComponent implements AfterViewInit {
  @ViewChildren('digitScroller')
  public digitScrollableElements: QueryList<ElementRef<HTMLDivElement>>;

  @Input()
  public digitsOfTheNumber = [0, 0];

  public ngAfterViewInit(): void {
    // center the scroll
    this.digitScrollableElements.map((d) => d.nativeElement.scroll({ top: 25 }));
  }

  public onScrollDigit(i: number) {
    const digitScrollableEl = this.digitScrollableElements.toArray()[i].nativeElement;

    const scrollOffset = digitScrollableEl.scrollTop;

    if (scrollOffset === 0) {
      this.digitsOfTheNumber[i]--;
      if (this.digitsOfTheNumber[i] < 0) {
        this.digitsOfTheNumber[i] = 9;
      }
      digitScrollableEl.scroll({ top: 25 });
    } else if (scrollOffset > 50) {
      this.digitsOfTheNumber[i]++;
      if (this.digitsOfTheNumber[i] > 9) {
        this.digitsOfTheNumber[i] = 0;
      }
      digitScrollableEl.scroll({ top: 25 });
    }
  }

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
}
