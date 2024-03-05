import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BottomControlsComponent } from '../../components/bottom-controls/bottom-controls.component';
import { RoundInfoComponent } from '../../components/round-info/round-info.component';
import { GameHolderService } from '../../game-services/game-holder.service';
import { GameService, GameServiceWithFlags } from '../../game-services/game.service';
import { intervalArray } from '../../utils/arrays';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [CommonModule, RoundInfoComponent, BottomControlsComponent],
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
})
export class ScoreboardComponent implements OnInit {
  public gameService: GameService & GameServiceWithFlags<'scoreboard'>;

  public constructor(
    public readonly gameHolderService: GameHolderService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    if (!this.gameHolderService.service.hasFlagActive('scoreboard')) {
      throw new Error(
        `It is not possible to load scoreboard page for game service ${this.gameHolderService.service.gameName}. It does not implement flag 'scoreboard'`
      );
    }

    this.gameService = this.gameHolderService.service;
  }

  public changeScoresForRound(round: number) {
    // TODO the service should provide the state to navigate to its corresponding enter score page
    const state = {
      players: this.gameService.players.map((p) => ({ ...p, punctuation: p.scores[round] })),
      roundNumber: round + 1,
    };
    this.router.navigate(['../', this.gameService.enterScoreRoute], { relativeTo: this.activatedRoute, state });
  }

  public changeScoreForPlayerAndRound(playerId: number, round: number) {
    // TODO the service should provide the state to navigate to its corresponding enter score page
    const player = this.gameService.players[playerId];
    const state = {
      players: [{ ...player, punctuation: player.scores[round] }],
      roundNumber: round + 1,
    };
    this.router.navigate(['../', this.gameService.enterScoreRoute], { relativeTo: this.activatedRoute, state });
  }

  public getRoundNumbersAsArray() {
    return intervalArray(this.gameService.getNextRoundNumber() - 1).map((r) => r - 1);
  }

  public getRoundScores(round: number) {
    return this.gameService.players.map((p) => p.scores[round]);
  }
}
