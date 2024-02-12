import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, QueryList, ViewChild, ViewChildren, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GamesSvgModule } from '../../svg/generated/games-svg.module';

export interface EnterPlayerNamesModel {
  teamName: string;
  playerNames: string[];
  dealingPlayerIndex: number;
}

@Component({
  selector: 'app-enter-player-names',
  standalone: true,
  imports: [CommonModule, DragDropModule, GamesSvgModule, FormsModule],
  templateUrl: './enter-player-names.component.html',
  styleUrls: ['./enter-player-names.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => EnterPlayerNamesComponent), multi: true }],
})
export class EnterPlayerNamesComponent implements AfterViewInit {
  @ViewChildren('playerInput')
  private playerInputs: QueryList<ElementRef<HTMLInputElement>>;
  public playerNames: string[] = ['', '', '', ''];

  @ViewChild('teamInput')
  private teamInput: ElementRef;
  public teamName: string = 'Jugadores';

  public dealingPlayerIndex: number = -1;

  @Input()
  public allowEditTeamName: boolean = false;

  public constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  public ngAfterViewInit() {
    this.adaptWidthOfTeamInputToWidthOfText();
  }

  public trackByPlayerIndex(index: number) {
    return index;
  }

  public onChangeTeamName() {
    this.adaptWidthOfTeamInputToWidthOfText();

    this.emitChanges();
  }

  public onChangePlayerName() {
    this.emitChanges();
  }

  public onChangeDealingPlayer(i: number) {
    this.dealingPlayerIndex = i;
    this.emitChanges();
  }

  private emitChanges() {
    const emitValue: EnterPlayerNamesModel = {
      teamName: this.teamName,
      playerNames: this.playerNames,
      dealingPlayerIndex: this.dealingPlayerIndex,
    };
    this._onChange(emitValue);
    this._onTouch();
  }

  private adaptWidthOfTeamInputToWidthOfText() {
    if (this.teamInput !== undefined) {
      const el = document.createElement('span');
      el.style.fontSize = '1.2rem'; // like in scss file
      el.textContent = this.teamName;
      document.body.append(el);
      this.teamInput.nativeElement.style.width = el.offsetWidth + 10 + 'px';
      el.remove();
    }
  }

  public addPlayer() {
    this.playerNames.push('');
    this.changeDetectorRef.detectChanges();
    this.playerInputs.last.nativeElement.focus();
    this.emitChanges();
  }

  public deletePlayer(index: number) {
    const playerNameDealing = this.playerNames[this.dealingPlayerIndex];
    this.playerNames.splice(index, 1);
    const playerNameDealingIndex = this.playerNames.indexOf(playerNameDealing);
    const playerBefore = this.dealingPlayerIndex - 1;
    this.dealingPlayerIndex = playerNameDealingIndex !== -1 ? playerNameDealingIndex : playerBefore !== -1 ? playerBefore : 0;
    this.emitChanges();
  }

  public onReorderingPlayer(event: CdkDragDrop<string[]>) {
    const dealingPlayerName = this.playerNames[this.dealingPlayerIndex];
    moveItemInArray(this.playerNames, event.previousIndex, event.currentIndex);
    this.dealingPlayerIndex = this.playerNames.indexOf(dealingPlayerName);
    this.emitChanges();
  }

  /********************* ControlValueAccesor *********************/

  private _onChange: any = () => {};
  private _onTouch: any = () => {};

  public writeValue(value: EnterPlayerNamesModel): void {
    if (!value) {
      this.teamName = 'Jugadores';
      this.playerNames = [''];
      this.dealingPlayerIndex = -1;
    } else {
      this.teamName = value.teamName;
      this.playerNames = value.playerNames;
      this.dealingPlayerIndex = value.dealingPlayerIndex;
    }

    this.adaptWidthOfTeamInputToWidthOfText();
  }

  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  public setDisabledState?(_: boolean): void {}
}
