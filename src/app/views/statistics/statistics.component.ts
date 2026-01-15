import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BottomControlsComponent } from '../../components/bottom-controls/bottom-controls.component';
import { RoundInfoComponent } from '../../components/round-info/round-info.component';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { Flag } from '../../game-services/flags';
import { GameHolderService } from '../../game-services/game-holder.service';
import { GameService, GameServiceWithFlags } from '../../game-services/game.service';
import { ProgressGraphComponent } from './progress-graph/progress-graph.component';

const STATISTICS_FLAGS = ['statistics', 'game:gameStartEnd'] as const; //as Flag[]

@Component({
    selector: 'app-statistics',
    imports: [CommonModule, BottomControlsComponent, ProgressGraphComponent, RoundInfoComponent],
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  public gameService: GameService & GameServiceWithFlags<(typeof STATISTICS_FLAGS)[number]>;
  public playedTime: string;

  public constructor(readonly gameHolderService: GameHolderService) {
    if (!gameHolderService.service.isGameServiceWithFlags(STATISTICS_FLAGS as unknown as Flag[])) {
      throw new Error(
        `Error StatisticsComponent: service '${gameHolderService.service.gameName}' does not implement flags [${STATISTICS_FLAGS.join(', ')}]`
      );
    }

    this.gameService = gameHolderService.service;
  }

  public ngOnInit(): void {
    this.setPlayedTime();
  }

  private setPlayedTime() {
    const timeGameStarted = +localStorage.getItem(LOCAL_STORE_KEYS.TIME_GAME_STARTS)!;
    const elapsedSeconds = (Date.now() - timeGameStarted) / 1e3;
    const minutes = Math.trunc((elapsedSeconds / 60) % 60);
    const hours = Math.trunc(elapsedSeconds / 3600);
    if (hours > 0) {
      this.playedTime = `${hours} ${hours == 1 ? 'hora' : 'horas'}`;
    }
    if (minutes > 0 && hours > 0) {
      this.playedTime = `${this.playedTime} y ${minutes} ${minutes == 1 ? 'minuto' : 'minutos'}`;
    } else if (minutes > 0) {
      this.playedTime = `${minutes} ${minutes == 1 ? 'minuto' : 'minutos'}`;
    }

    if (hours == 0 && minutes == 0) {
      this.playedTime = 'Menos de un minuto';
    }
  }
}
