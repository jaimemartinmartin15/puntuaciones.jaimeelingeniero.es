import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { Flag } from '../../game-services/flags';
import { GameHolderService } from '../../game-services/game-holder.service';
import { GameService, GameServiceWithFlags } from '../../game-services/game.service';
import { enterScoreBaseAnimation } from '../../shared/enter-score/enter-score-base.animation';

const ENTER_SCORE_FLAGS = ['enterScore'] as const; //as Flag[]

@Component({
    selector: 'app-enter-score',
    templateUrl: './enter-score.component.html',
    styleUrls: ['./enter-score.component.scss'],
    animations: [enterScoreBaseAnimation]
})
export class EnterScoreComponent {
  public gameService: GameService & GameServiceWithFlags<(typeof ENTER_SCORE_FLAGS)[number]>;

  private sign: '+' | '-' = '+';

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
    if (!gameHolderService.service.isGameServiceWithFlags(ENTER_SCORE_FLAGS as unknown as Flag[])) {
      throw new Error(
        `Error EnterScoreComponent: service '${gameHolderService.service.gameName}' does not implement flags [${ENTER_SCORE_FLAGS.join(', ')}]`
      );
    }

    this.gameService = gameHolderService.service;

    // read EnterScoreInput
    this.roundNumber = this.router.getCurrentNavigation()?.extras?.state?.['roundNumber'];
    this.playerNames = this.router.getCurrentNavigation()?.extras?.state?.['playerNames'];
    this.punctuations = this.router.getCurrentNavigation()?.extras?.state?.['punctuations'];

    this.sign = this.puntuationCurrentPlayer >= 0 ? '+' : '-';
  }

  public onClickKeyBoard(event: Event) {
    const buttonKey = (event.target as HTMLElement).closest('button')?.textContent;

    if (buttonKey == null) {
      // clicked the keyboard, but not a button
      return;
    }

    if (buttonKey.includes('→') || buttonKey.includes('✔️')) {
      this.currentPlayerIndex++;
      if (this.currentPlayerIndex === this.playerNames.length) {
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

  public closeEnterScore() {
    this.location.back();
  }

  private finishEnterScore() {
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
