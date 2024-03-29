import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ROUTING_PATHS } from '../../constants/routes';
import { GameHolderService } from '../../game-services/game-holder.service';

@Component({
  selector: 'app-bottom-controls',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bottom-controls.component.html',
  styleUrls: ['./bottom-controls.component.scss'],
})
export class BottomControlsComponent {
  public readonly ROUTING_PATHS = ROUTING_PATHS;
  public showViewNavigation: boolean = false;

  public constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    public readonly gameHolderService: GameHolderService
  ) {}

  public goToGameConfigView() {
    this.router.navigate(['../', ROUTING_PATHS.GAME_CONFIG], { relativeTo: this.activatedRoute });
  }

  public enterNewRound() {
    const state = {
      players: this.gameHolderService.service.players.map((p) => ({ ...p, punctuation: 0 })),
      roundNumber: this.gameHolderService.service.getNextRoundNumber(),
    };
    this.router.navigate(['../', this.gameHolderService.service.enterScoreRoute], { relativeTo: this.activatedRoute, state });
  }
}
