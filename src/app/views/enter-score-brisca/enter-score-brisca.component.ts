import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BriscaService } from '../../game-services/brisca.service';
import { GameHolderService } from '../../game-services/game-holder.service';

@Component({
  selector: 'app-enter-score-brisca',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enter-score-brisca.component.html',
  styleUrls: ['./enter-score-brisca.component.scss'],
})
export class EnterScoreBriscaComponent implements OnInit {
  public briscaService: BriscaService;
  public names: string[] = [];

  public constructor(private readonly location: Location, gameHolderService: GameHolderService) {
    if (!(gameHolderService.service instanceof BriscaService)) {
      throw new Error('Cannot load EnterScoreBrisca component because game holder service does not contain a BriscaService');
    }

    this.briscaService = gameHolderService.service;
  }

  public ngOnInit() {
    if (this.briscaService.modality === 'individual') {
      this.names = this.briscaService.playerNames;
    } else if (this.briscaService.modality === 'teams') {
      this.names = this.briscaService.teamNames;
    }
  }

  public addPointToIndex(i: number) {
    this.briscaService.scores[i]++;
    this.briscaService.setNextDealingPlayer();
    this.closeEnterScore();
  }

  public closeEnterScore() {
    this.location.back();
  }
}
