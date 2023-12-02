import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
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

  public constructor(public readonly gameHolderService: GameHolderService) {}

  public get playerPosition() {
    return this.gameHolderService.service.getPlayerPosition(this.playerId);
  }
}
