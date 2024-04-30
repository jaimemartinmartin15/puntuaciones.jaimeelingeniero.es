import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BottomControlsComponent } from '../../components/bottom-controls/bottom-controls.component';
import { RoundInfoComponent } from '../../components/round-info/round-info.component';
import { Flag } from '../../game-services/flags';
import { GameHolderService } from '../../game-services/game-holder.service';
import { GameService, GameServiceWithFlags } from '../../game-services/game.service';
import { intervalArray } from '../../utils/arrays';

const SCOREBOARD_FLAGS = ['scoreboard', 'game:gameStartEnd', 'game:rounds'] as const; // as Flag[]

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [CommonModule, RoundInfoComponent, BottomControlsComponent],
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
})
export class ScoreboardComponent {
  public gameService: GameService & GameServiceWithFlags<(typeof SCOREBOARD_FLAGS)[number]>;

  public constructor(
    public readonly gameHolderService: GameHolderService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
    if (!gameHolderService.service.isGameServiceWithFlags(SCOREBOARD_FLAGS as unknown as Flag[])) {
      throw new Error(
        `Error ScoreboardComponent: service '${gameHolderService.service.gameName}' does not implement flags [${SCOREBOARD_FLAGS.join(', ')}]`
      );
    }

    this.gameService = gameHolderService.service;
  }

  public changeScoresForRound(round: number) {
    // TODO implement flag enterScore that has a method that gets the state?
    const state = {
      playerNames: this.gameService.playerNames,
      punctuations: this.gameService.playerNames.map((_, id) => this.gameService.getPlayerScore(id, round)),
      roundNumber: round + 1,
    };
    this.router.navigate(['../', this.gameService.enterScoreRoute], { relativeTo: this.activatedRoute, state });
  }

  public changeScoreForPlayerAndRound(playerId: number, round: number) {
    // TODO implement flag enterScore that has a method that gets the state?
    const state = {
      playerNames: [this.gameService.playerNames[playerId]],
      punctuations: [this.gameService.getPlayerScore(playerId, round)],
      roundNumber: round + 1,
    };
    this.router.navigate(['../', this.gameService.enterScoreRoute], { relativeTo: this.activatedRoute, state });
  }

  public getRoundNumbersAsArray() {
    return intervalArray(this.gameService.getNextRoundNumber() - 1).map((r) => r - 1);
  }
}
