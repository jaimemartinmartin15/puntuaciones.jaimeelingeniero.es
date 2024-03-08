import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BottomControlsComponent } from '../../components/bottom-controls/bottom-controls.component';
import { RoundInfoComponent } from '../../components/round-info/round-info.component';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { GameHolderService } from '../../game-services/game-holder.service';
import { ProgressGraphComponent } from './progress-graph/progress-graph.component';
import { GameService, GameServiceWithFlags } from '../../game-services/game.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, BottomControlsComponent, ProgressGraphComponent, RoundInfoComponent],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  public gameService: GameService & GameServiceWithFlags<'statistics'>;
  public playedTime: string;

  public constructor(public readonly gameHolderService: GameHolderService) {}

  public ngOnInit(): void {
    if (!this.gameHolderService.service.hasFlagActive('statistics')) {
      throw new Error(
        `It is not possible to load statistics page for game service ${this.gameHolderService.service.gameName}. It does not implement flag 'statistics'`
      );
    }
    this.gameService = this.gameHolderService.service;
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
