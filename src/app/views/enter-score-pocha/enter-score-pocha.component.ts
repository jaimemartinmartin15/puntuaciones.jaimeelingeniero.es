import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameHolderService } from '../../game-services/game-holder.service';
import { Player } from '../../interfaces/player';
import { enterScorePochaAnimation } from './enter-score-pocha.animation';

@Component({
  selector: 'app-enter-score-pocha',
  standalone: true,
  imports: [CommonModule],
  providers: [Location],
  templateUrl: './enter-score-pocha.component.html',
  styleUrls: ['./enter-score-pocha.component.scss'],
  animations: [enterScorePochaAnimation],
})
export class EnterScorePochaComponent {
  public players: Player[];
  public roundNumber: number;

  public currentPlayerIndex = 0;

  public constructor(private readonly router: Router, private readonly location: Location, private readonly gameHolderService: GameHolderService) {
    this.roundNumber = this.router.getCurrentNavigation()?.extras?.state?.['roundNumber'];
    this.players = this.router.getCurrentNavigation()?.extras?.state?.['players'];
  }

  public closeEnterScorePocha() {
    this.location.back();
  }

  public nextPlayer() {
    if (this.currentPlayerIndex === this.players.length - 1) {
      // TODO it is last player to enter score, save and return

      return;
    }

    this.currentPlayerIndex++;
  }

  public onClickKeyboard(event: any) {
    // TODO set player punctuation
  }
}
