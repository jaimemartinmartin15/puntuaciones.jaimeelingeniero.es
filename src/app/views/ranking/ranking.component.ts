import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BottomControlsComponent } from '../../components/bottom-controls/bottom-controls.component';
import { RoundInfoComponent } from '../../components/round-info/round-info.component';
import { Flag } from '../../game-services/flags';
import { GameHolderService } from '../../game-services/game-holder.service';
import { GameService, GameServiceWithFlags } from '../../game-services/game.service';
import { PlayerDisplayComponent } from './player-display/player-display.component';

const RANKING_FLAGS = ['ranking', 'game:gameStartEnd'] as const; //as Flag[]

@Component({
    selector: 'app-ranking',
    imports: [CommonModule, RoundInfoComponent, BottomControlsComponent, PlayerDisplayComponent],
    templateUrl: './ranking.component.html',
    styleUrls: ['./ranking.component.scss']
})
export class RankingComponent {
  public gameService: GameService & GameServiceWithFlags<(typeof RANKING_FLAGS)[number]>;

  public constructor(readonly gameHolderService: GameHolderService) {
    if (!gameHolderService.service.isGameServiceWithFlags(RANKING_FLAGS as unknown as Flag[])) {
      throw new Error(
        `Error RankingComponent: service '${gameHolderService.service.gameName}' does not implement flags [${RANKING_FLAGS.join(', ')}]`
      );
    }

    this.gameService = gameHolderService.service;
  }
}
