import { Component, HostBinding, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Flag } from '../../../game-services/flags';
import { GameHolderService } from '../../../game-services/game-holder.service';
import { GameService, GameServiceWithFlags } from '../../../game-services/game.service';
import { EnterScoreInput } from '../../../shared/enter-score/EnterScoreInput';

const PLAYER_DISPLAY_FLAGS = ['ranking:playerDisplay', 'game:rounds'] as const; //as Flag[]

@Component({
    selector: 'app-player-display',
    templateUrl: './player-display.component.html',
    styleUrls: ['./player-display.component.scss']
})
export class PlayerDisplayComponent {
  public gameService: GameService & GameServiceWithFlags<(typeof PLAYER_DISPLAY_FLAGS)[number]>;

  @Input()
  public playerId: number;

  @HostBinding('class')
  public get styleClassPosition() {
    return `position-${this.playerPosition}`;
  }

  public constructor(
    readonly gameHolderService: GameHolderService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
    if (!gameHolderService.service.isGameServiceWithFlags(PLAYER_DISPLAY_FLAGS as unknown as Flag[])) {
      throw new Error(
        `Error PlayerDisplayComponent: service '${gameHolderService.service.gameName}' does not implement flags [${PLAYER_DISPLAY_FLAGS.join(', ')}]`
      );
    }

    this.gameService = gameHolderService.service;
  }

  public get playerPosition() {
    return this.gameService.getPlayerPosition(this.playerId);
  }

  public navigateToSetNewScore() {
    // TODO implement flag enterScore that has a method that gets the state?
    const state: EnterScoreInput = {
      playerNames: [this.gameService.getPlayerName(this.playerId)],
      punctuations: [this.gameService.getScoreLastRound(this.playerId)],
      roundNumber: this.gameService.getNextRoundNumber() - 1,
    };
    this.router.navigate(['../', this.gameService.enterScoreRoute], { relativeTo: this.activatedRoute, state });
  }
}
