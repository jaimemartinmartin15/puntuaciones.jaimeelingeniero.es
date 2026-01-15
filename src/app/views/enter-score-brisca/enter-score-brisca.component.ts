import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Flag } from '../../game-services/flags';
import { GameHolderService } from '../../game-services/game-holder.service';
import { GameService, GameServiceWithFlags } from '../../game-services/game.service';

const ENTER_SCORE_BRISCA_FLAGS = ['enterScore:brisca'] as const; //as Flag[]

@Component({
    selector: 'app-enter-score-brisca',
    templateUrl: './enter-score-brisca.component.html',
    styleUrls: ['./enter-score-brisca.component.scss']
})
export class EnterScoreBriscaComponent implements OnInit {
  public gameService: GameService & GameServiceWithFlags<(typeof ENTER_SCORE_BRISCA_FLAGS)[number]>;
  public names: string[] = [];

  public constructor(private readonly location: Location, gameHolderService: GameHolderService) {
    if (!gameHolderService.service.isGameServiceWithFlags(ENTER_SCORE_BRISCA_FLAGS as unknown as Flag[])) {
      throw new Error(
        `Error EnterScoreBriscaComponent: service '${gameHolderService.service.gameName}' does not implement flags [${ENTER_SCORE_BRISCA_FLAGS.join(', ')}]`
      );
    }

    this.gameService = gameHolderService.service;
  }

  public ngOnInit() {
    if (this.gameService.modality === 'individual') {
      this.names = this.gameService.playerNames;
    } else if (this.gameService.modality === 'teams') {
      this.names = this.gameService.teamNames;
    }
  }

  public addPointToIndex(i: number) {
    this.gameService.scores[i]++;
    this.gameService.setNextDealingPlayer();
    if (this.gameService.hasFlagActive('game:localStorageSave')) {
      this.gameService.saveStateToLocalStorage();
    }
    this.closeEnterScore();
  }

  public closeEnterScore() {
    this.location.back();
  }
}
