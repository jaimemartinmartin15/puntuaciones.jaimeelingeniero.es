import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameHolderService } from '../../game-services/game-holder.service';
import { EnterScoreBase } from '../../shared/enter-score/EnterScoreBase';
import { enterScoreBaseAnimation } from '../../shared/enter-score/enter-score-base.animation';

@Component({
  selector: 'app-enter-score-pocha',
  standalone: true,
  imports: [CommonModule],
  providers: [Location],
  templateUrl: './enter-score-pocha.component.html',
  styleUrls: ['./enter-score-pocha.component.scss'],
  animations: [enterScoreBaseAnimation],
})
export class EnterScorePochaComponent extends EnterScoreBase {
  public constructor(router: Router, location: Location, gameHolderService: GameHolderService) {
    super(location, router, gameHolderService);
    if (this.roundNumber === this.gameHolderService.service.getNextRoundNumber()) {
      // only if it is a new round, init to 5 by default
      this.players.forEach((p) => (p.punctuation = 5));
    }
  }

  protected override passValidation(): boolean {
    let isInvalid = false;

    // scores cannot be ... , -15 , -5 , 0 , 15 , 25 , ...
    isInvalid ||= this.players.some((p) => p.punctuation === 0 || (p.punctuation !== 5 && Math.abs(p.punctuation % 10) === 5));

    // if it is editing all scores of a round, check at least one is negative
    isInvalid ||= this.players.length === this.gameHolderService.service.players.length && this.players.every((p) => p.punctuation > 0);

    return !isInvalid;
  }

  protected override getPlayerIndexWithWrongScore(): number {
    return this.players.indexOf(
      this.players.find((p) => p.punctuation == 0 || (p.punctuation !== 5 && Math.abs(p.punctuation % 10) === 5)) || this.players[0]
    );
  }

  public onClickKeyboard(event: Event) {
    const buttonKey = (event.target as HTMLElement).closest('button')?.textContent;

    if (buttonKey == null) {
      // clicked the keyboard, but not a button
      return;
    }

    if (buttonKey === '→' || buttonKey === '✔️') {
      this.currentPlayerIndex++;
      if (this.currentPlayerIndex === this.players.length) {
        this.finishEnterScore();
      }
      return;
    }

    if (buttonKey === '←' && this.currentPlayerIndex > 0) {
      this.currentPlayerIndex--;
      return;
    }

    if (buttonKey === 'restar10') {
      this.puntuationCurrentPlayer -= 10;
      return;
    }

    if (buttonKey === 'sumar10') {
      this.puntuationCurrentPlayer += 10;
      return;
    }

    this.puntuationCurrentPlayer = +buttonKey;
  }
}
