import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameHolderService } from '../../../game-services/game-holder.service';
import { GameService, GameServiceWithFlags } from '../../../game-services/game.service';

@Component({
  selector: 'app-player-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-display.component.html',
  styleUrls: ['./player-display.component.scss'],
})
export class PlayerDisplayComponent implements OnInit {
  public gameService: GameService & GameServiceWithFlags<'ranking'>;

  @Input()
  public playerId: number;

  @HostBinding('class')
  public get styleClassPosition() {
    return `position-${this.playerPosition}`;
  }

  public constructor(
    public readonly gameHolderService: GameHolderService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    if (!this.gameHolderService.service.hasFlagActive('ranking')) {
      throw new Error(
        `It is not possible to show player display in ranking view for game service ${this.gameHolderService.service.gameName}. It does not implement flag 'ranking'`
      );
    }

    this.gameService = this.gameHolderService.service;
  }

  public get playerPosition() {
    return this.gameService.getPlayerPosition(this.playerId);
  }

  public navigateToSetNewScore() {
    const player = this.gameService.players[this.playerId];
    const punctuation = this.gameService.getScoreLastRound(this.playerId);
    const state = {
      players: [{ ...player, punctuation }],
      roundNumber: this.gameService.getNextRoundNumber() - 1,
    };
    this.router.navigate(['../', this.gameService.enterScoreRoute], { relativeTo: this.activatedRoute, state });
  }
}
