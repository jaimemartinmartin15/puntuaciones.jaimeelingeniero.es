import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTING_PATHS } from '../../constants/routes';
import { Flag } from '../../game-services/flags';
import { GameHolderService } from '../../game-services/game-holder.service';
import { GameService, GameServiceWithFlags } from '../../game-services/game.service';

const ROUND_INFO_FLAGS = ['game:gameStartEnd', 'game:rounds'] as const; //as Flag[]

@Component({
    selector: 'app-round-info',
    imports: [CommonModule],
    templateUrl: './round-info.component.html',
    styleUrls: ['./round-info.component.scss']
})
export class RoundInfoComponent {
  public gameService: GameService & GameServiceWithFlags<(typeof ROUND_INFO_FLAGS)[number]>;

  public constructor(gameHolderService: GameHolderService, private readonly router: Router, private readonly activatedRoute: ActivatedRoute) {
    if (!gameHolderService.service.isGameServiceWithFlags(ROUND_INFO_FLAGS as unknown as Flag[])) {
      throw new Error(
        `Error RoundInfoComponent: service '${gameHolderService.service.gameName}' does not implement flags [${ROUND_INFO_FLAGS.join(', ')}]`
      );
    }

    this.gameService = gameHolderService.service;
  }

  @HostListener('click')
  public navigateToChangeConfig() {
    this.router.navigate(['../', ROUTING_PATHS.CHANGE_CONFIG], { relativeTo: this.activatedRoute });
  }
}
