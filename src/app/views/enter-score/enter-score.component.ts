import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameHolderService } from '../../game-services/game-holder.service';
import { EnterScoreBase } from '../../shared/enter-score/EnterScoreBase';
import { enterScoreBaseAnimation } from '../../shared/enter-score/enter-score-base.animation';

@Component({
  selector: 'app-enter-score',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enter-score.component.html',
  styleUrls: ['./enter-score.component.scss'],
  animations: [enterScoreBaseAnimation],
})
export class EnterScoreComponent extends EnterScoreBase {
  private sign: '+' | '-' = '+';

  public constructor(location: Location, router: Router, gameHolderService: GameHolderService) {
    super(location, router, gameHolderService);
    this.sign = this.puntuationCurrentPlayer >= 0 ? '+' : '-';
  }

  protected override passValidation(): boolean {
    return true;
  }

  protected override getPlayerIndexWithWrongScore(): number {
    // Note: this method is not called because passValidation returns always true
    return -1;
  }

  public onClickKeyBoard(event: Event) {
    const buttonKey = (event.target as HTMLElement).closest('button')?.textContent;

    if (buttonKey == null) {
      // clicked the keyboard, but not a button
      return;
    }

    if (buttonKey.includes('→') || buttonKey.includes('✔️')) {
      this.currentPlayerIndex++;
      if (this.currentPlayerIndex === this.players.length) {
        this.finishEnterScore();
        return;
      }
      this.sign = this.puntuationCurrentPlayer >= 0 ? '+' : '-';
      return;
    }

    if (buttonKey.includes('←') && this.currentPlayerIndex > 0) {
      this.currentPlayerIndex--;
      this.sign = this.puntuationCurrentPlayer >= 0 ? '+' : '-';
      return;
    }

    if (buttonKey.includes('⌫')) {
      this.puntuationCurrentPlayer = +`${this.puntuationCurrentPlayer}`.slice(0, -1);
      if (Number.isNaN(this.puntuationCurrentPlayer)) {
        // in case only the '-' is in the string, replace with 0
        this.puntuationCurrentPlayer = 0;
        this.sign = '+';
      }
      return;
    }

    if (buttonKey.includes('±')) {
      this.sign = this.sign === '-' ? '+' : '-';
      this.puntuationCurrentPlayer = -this.puntuationCurrentPlayer;
      return;
    }

    // user pressed number key
    const key = +buttonKey!;
    this.puntuationCurrentPlayer = +`${this.sign}${Math.abs(this.puntuationCurrentPlayer)}${key}`;
  }
}
