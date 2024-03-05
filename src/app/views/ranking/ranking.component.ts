import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BottomControlsComponent } from '../../components/bottom-controls/bottom-controls.component';
import { RoundInfoComponent } from '../../components/round-info/round-info.component';
import { GameHolderService } from '../../game-services/game-holder.service';
import { GameService, GameServiceWithFlags } from '../../game-services/game.service';
import { PlayerDisplayComponent } from './player-display/player-display.component';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, RoundInfoComponent, BottomControlsComponent, PlayerDisplayComponent],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
})
export class RankingComponent implements OnInit {
  public gameService: GameService & GameServiceWithFlags<'ranking'>;

  public constructor(public readonly gameHolderService: GameHolderService) {}

  public ngOnInit(): void {
    if (!this.gameHolderService.service.hasFlagActive('ranking')) {
      throw new Error(
        `It is not possible to load ranking page for game service ${this.gameHolderService.service.gameName}. It does not implement flag 'ranking'`
      );
    }

    this.gameService = this.gameHolderService.service;
  }
}
