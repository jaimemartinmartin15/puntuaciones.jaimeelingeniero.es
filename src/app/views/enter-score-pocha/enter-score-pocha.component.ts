import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { GameHolderService } from '../../game-services/game-holder.service';
import { Player } from '../../interfaces/player';
import { enterScorePochaAnimation } from './enter-score-pocha.animation';

@Component({
  selector: 'app-enter-score-pocha',
  standalone: true,
  imports: [CommonModule],
  providers: [Location],
  templateUrl: './enter-score-pocha.component.html',
  styleUrls: ['./enter-score-pocha.component.scss'],
  animations: [enterScorePochaAnimation],
})
export class EnterScorePochaComponent {
  public players: Player[];
  public roundNumber: number;

  public currentPlayerIndex = 0;

  private get puntuationCurrentPlayer() {
    return this.players[this.currentPlayerIndex].punctuation;
  }

  private set puntuationCurrentPlayer(punctuation: number) {
    this.players[this.currentPlayerIndex].punctuation = punctuation;
  }

  public constructor(private readonly router: Router, private readonly location: Location, private readonly gameHolderService: GameHolderService) {
    this.roundNumber = this.router.getCurrentNavigation()?.extras?.state?.['roundNumber'];
    this.players = this.router.getCurrentNavigation()?.extras?.state?.['players'];
    this.players.forEach((p) => (p.punctuation = 5));
  }

  public closeEnterScorePocha() {
    this.location.back();
  }

  public onClickKeyboard(event: Event) {
    const buttonKey = (event.target as HTMLElement).closest('button')?.textContent;

    if (buttonKey == null) {
      // clicked the keyboard, but not any button
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

  public finishEnterScore() {
    // validation: scores cannot be empty, and if it is editing all scores of a round, check at least one is negative
    if (
      this.players.some((p) => p.punctuation === 0) ||
      (this.players.length === this.gameHolderService.service.players.length && this.players.every((p) => p.punctuation > 0))
    ) {
      this.currentPlayerIndex = this.players.indexOf(this.players.find((p) => p.punctuation == 0) || this.players[0]);
      return;
    }

    // change the player that deals only if it is a new round (not edition in table view)
    if (this.roundNumber === this.gameHolderService.service.getNextRoundNumber()) {
      this.gameHolderService.service.setNextDealingPlayer();
    }
    this.players.forEach((p) => (p.scores[this.roundNumber - 1] = p.punctuation));
    this.saveGameLocalStorage();
    this.location.back();
  }

  private saveGameLocalStorage() {
    localStorage.setItem(LOCAL_STORE_KEYS.PLAYERS, JSON.stringify(this.gameHolderService.service.players));
    localStorage.setItem(
      LOCAL_STORE_KEYS.CONFIG,
      JSON.stringify({
        numberOfCards: this.gameHolderService.service.numberOfCards,
        limitScore: this.gameHolderService.service.limitScore,
        winner: this.gameHolderService.service.winner,
      })
    );
    localStorage.setItem(LOCAL_STORE_KEYS.DEALING_PLAYER_INDEX, JSON.stringify(this.gameHolderService.service.dealingPlayerIndex));
    localStorage.setItem(LOCAL_STORE_KEYS.GAME_NAME, this.gameHolderService.service.gameName);
    localStorage.setItem(LOCAL_STORE_KEYS.TIME_LAST_GAME, JSON.stringify(Date.now()));
  }
}
