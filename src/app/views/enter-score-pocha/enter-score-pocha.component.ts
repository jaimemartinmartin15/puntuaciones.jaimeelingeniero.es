import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { Flag } from '../../game-services/flags';
import { GameHolderService } from '../../game-services/game-holder.service';
import { GameService, GameServiceWithFlags } from '../../game-services/game.service';
import { enterScoreBaseAnimation } from '../../shared/enter-score/enter-score-base.animation';

const ENTER_SCORE_POCHA_FLAGS = ['enterScore', 'enterScore:pocha'] as const; //as Flag[]

@Component({
    selector: 'app-enter-score-pocha',
    imports: [CommonModule],
    templateUrl: './enter-score-pocha.component.html',
    styleUrls: ['./enter-score-pocha.component.scss'],
    animations: [enterScoreBaseAnimation]
})
export class EnterScorePochaComponent {
  public gameService: GameService & GameServiceWithFlags<(typeof ENTER_SCORE_POCHA_FLAGS)[number]>;

  public roundNumber: number;
  public playerNames: string[];
  public punctuations: number[];

  public currentPlayerIndex = 0;

  public get puntuationCurrentPlayer() {
    return this.punctuations[this.currentPlayerIndex];
  }

  public set puntuationCurrentPlayer(punctuation: number) {
    this.punctuations[this.currentPlayerIndex] = punctuation;
  }

  public constructor(private readonly location: Location, private readonly router: Router, readonly gameHolderService: GameHolderService) {
    if (!gameHolderService.service.isGameServiceWithFlags(ENTER_SCORE_POCHA_FLAGS as unknown as Flag[])) {
      throw new Error(
        `Error EnterScorePochaComponent: service '${gameHolderService.service.gameName}' does not implement flags [${ENTER_SCORE_POCHA_FLAGS.join(
          ', '
        )}]`
      );
    }

    this.gameService = gameHolderService.service;

    // read EnterScoreInput
    this.roundNumber = this.router.getCurrentNavigation()?.extras?.state?.['roundNumber'];
    this.playerNames = this.router.getCurrentNavigation()?.extras?.state?.['playerNames'];
    this.punctuations = this.router.getCurrentNavigation()?.extras?.state?.['punctuations'];
  }

  public onClickKeyboard(event: Event) {
    const buttonKey = (event.target as HTMLElement).closest('button')?.textContent;

    if (buttonKey == null) {
      // clicked the keyboard, but not a button
      return;
    }

    if (buttonKey.includes('→') || buttonKey.includes('✔️')) {
      this.currentPlayerIndex++;
      if (this.currentPlayerIndex === this.playerNames.length) {
        this.finishEnterScore();
      }
      return;
    }

    if (buttonKey.includes('←') && this.currentPlayerIndex > 0) {
      this.currentPlayerIndex--;
      return;
    }

    if (buttonKey.includes('restar10')) {
      this.puntuationCurrentPlayer -= 10;
      return;
    }

    if (buttonKey.includes('sumar10')) {
      this.puntuationCurrentPlayer += 10;
      return;
    }

    this.puntuationCurrentPlayer = +buttonKey;
  }

  public closeEnterScore() {
    this.location.back();
  }

  private passValidation(): boolean {
    let isInvalid = false;

    // scores cannot be ... , -15 , -5 , 0 , 15 , 25 , ...
    isInvalid ||= this.punctuations.some((p) => p === 0 || (p !== 5 && Math.abs(p % 10) === 5));

    // if it is editing all scores of a round, check at least one is negative
    isInvalid ||= this.playerNames.length === this.gameService.playerNames.length && this.punctuations.every((p) => p > 0);

    return !isInvalid;
  }

  private getPlayerIndexWithWrongScore(): number {
    // if wrong score is undefined, then all scores are positive
    const wrongScore = this.punctuations.find((p) => p === 0 || (p !== 5 && Math.abs(p % 10) === 5));
    return wrongScore !== undefined ? this.punctuations.indexOf(wrongScore) : 0;
  }

  private finishEnterScore() {
    if (!this.passValidation()) {
      this.currentPlayerIndex = this.getPlayerIndexWithWrongScore();
      return;
    }

    // change the player that deals only if it is a new round (not edition of previous score)
    if (this.roundNumber === this.gameService.getNextRoundNumber()) {
      // TODO create enterScore:dealingPlayer flag for this?
      this.gameService.setNextDealingPlayer();
    }

    this.playerNames.forEach((playerName, playerIndex) =>
      this.gameService.setPlayerScore(this.gameService.getPlayerId(playerName), this.roundNumber - 1, this.punctuations[playerIndex])
    );

    if (this.gameService.hasFlagActive('game:localStorageSave')) {
      this.gameService.saveStateToLocalStorage();
    }

    localStorage.setItem(LOCAL_STORE_KEYS.TIME_LAST_INTERACTION, JSON.stringify(Date.now()));
    this.closeEnterScore();
  }
}
