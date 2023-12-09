import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { GameHolderService } from '../../game-services/game-holder.service';
import { Player } from '../../interfaces/player';

export abstract class EnterScoreBase {
  protected abstract passValidation(): boolean;
  protected abstract getPlayerIndexWithWrongScore(): number;

  public roundNumber: number;
  public players: Player[];

  protected currentPlayerIndex = 0;

  protected get puntuationCurrentPlayer() {
    return this.players[this.currentPlayerIndex].punctuation;
  }

  protected set puntuationCurrentPlayer(punctuation: number) {
    this.players[this.currentPlayerIndex].punctuation = punctuation;
  }

  public constructor(
    protected readonly location: Location,
    protected readonly router: Router,
    protected readonly gameHolderService: GameHolderService
  ) {
    this.roundNumber = this.router.getCurrentNavigation()?.extras?.state?.['roundNumber'];
    this.players = this.router.getCurrentNavigation()?.extras?.state?.['players'];
  }

  public closeEnterScore() {
    this.location.back();
  }

  protected finishEnterScore() {
    if (!this.passValidation()) {
      this.currentPlayerIndex = this.getPlayerIndexWithWrongScore();
      return;
    }

    // change the player that deals only if it is a new round (not edition of previous score)
    if (this.roundNumber === this.gameHolderService.service.getNextRoundNumber()) {
      this.gameHolderService.service.setNextDealingPlayer();
    }
    this.players.forEach((p) => (p.scores[this.roundNumber - 1] = p.punctuation));
    this.saveGameLocalStorage();
    this.closeEnterScore();
  }

  protected saveGameLocalStorage() {
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
