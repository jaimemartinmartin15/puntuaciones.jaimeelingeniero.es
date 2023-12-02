import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BottomControlsComponent } from '../../components/bottom-controls/bottom-controls.component';
import { RoundInfoComponent } from '../../components/round-info/round-info.component';
import { GameHolderService } from '../../game-services/game-holder.service';
import { PlayerDisplayComponent } from './player-display/player-display.component';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, RoundInfoComponent, BottomControlsComponent, PlayerDisplayComponent],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
})
export class RankingComponent {
  public constructor(public readonly gameHolderService: GameHolderService) {}
}
