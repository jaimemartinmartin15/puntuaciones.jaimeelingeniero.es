import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTING_PATHS } from '../../../app.routes';
import { GameHolderService } from '../../../game-services/game-holder.service';

@Component({
  selector: 'app-player-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-display.component.html',
  styleUrls: ['./player-display.component.scss'],
})
export class PlayerDisplayComponent {
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

  public get playerPosition() {
    return this.gameHolderService.service.getPlayerPosition(this.playerId);
  }

  public navigateToSetNewScore() {
    const player = this.gameHolderService.service.players[this.playerId];
    const punctuation = this.gameHolderService.service.getScoreLastRound(this.playerId);
    const state = {
      players: [{ ...player, punctuation }],
      roundNumber: this.gameHolderService.service.getNextRoundNumber() - 1,
    };
    this.router.navigate(['../', ROUTING_PATHS.ENTER_SCORE], { relativeTo: this.activatedRoute, state });
  }
}
