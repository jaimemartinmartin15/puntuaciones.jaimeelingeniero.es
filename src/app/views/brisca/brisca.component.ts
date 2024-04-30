import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BottomControlsComponent } from '../../components/bottom-controls/bottom-controls.component';
import { RoundInfoComponent } from '../../components/round-info/round-info.component';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { Flag } from '../../game-services/flags';
import { GameHolderService } from '../../game-services/game-holder.service';
import { GameService, GameServiceWithFlags } from '../../game-services/game.service';
import { intervalArray } from '../../utils/arrays';

interface PlayerInfo {
  name: string;
  score: number;
  deletePointProgress: number;
}

const BRISCA_FLAGS = ['brisca', 'game:localStorageSave'] as const; // as Flag[]

@Component({
  selector: 'app-brisca',
  standalone: true,
  imports: [CommonModule, RoundInfoComponent, BottomControlsComponent],
  templateUrl: './brisca.component.html',
  styleUrls: ['./brisca.component.scss'],
})
export class BriscaComponent implements OnInit {
  private readonly CLICKS_TO_DELETE_POINT = 5;
  public readonly BULLET_INTERVAL = 5;

  public playersInfo: PlayerInfo[] = [];
  public showDeleteBanner = true;
  public gameService: GameService & GameServiceWithFlags<(typeof BRISCA_FLAGS)[number]>;

  public constructor(gameHolderService: GameHolderService) {
    if (!gameHolderService.service.isGameServiceWithFlags(BRISCA_FLAGS as unknown as Flag[])) {
      throw new Error(`Error BriscaComponent: service '${gameHolderService.service.gameName}' does not implement flags [${BRISCA_FLAGS.join(', ')}]`);
    }

    this.gameService = gameHolderService.service;
  }

  public ngOnInit(): void {
    this.checkShowDeleteBanner();

    let names: string[] = [];
    if (this.gameService.modality === 'individual') {
      names = this.gameService.playerNames;
    } else if (this.gameService.modality === 'teams') {
      names = this.gameService.teamNames;
    }

    this.playersInfo = names.map((name, i) => {
      return {
        name,
        score: this.gameService.scores[i],
        deletePointProgress: 0,
      };
    });
  }

  private checkShowDeleteBanner() {
    const lastTimeDeleteBanner = localStorage.getItem(LOCAL_STORE_KEYS.BRISCA_LAST_TIME_DELETE_BANNER);
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    this.showDeleteBanner = lastTimeDeleteBanner === null || oneDayAgo > +lastTimeDeleteBanner;
  }

  public closeDeleteBanner() {
    this.showDeleteBanner = false;
    localStorage.setItem(LOCAL_STORE_KEYS.BRISCA_LAST_TIME_DELETE_BANNER, JSON.stringify(Date.now()));
  }

  public changeScoreOf(playerIndex: number) {
    const player = this.playersInfo[playerIndex];
    player.deletePointProgress++;
    if (player.deletePointProgress === this.CLICKS_TO_DELETE_POINT && player.score > 0) {
      player.deletePointProgress = 0;

      player.score--;
      this.gameService.scores[playerIndex]--;

      this.gameService.setPreviousDealingPlayerIndex();
      this.gameService.saveStateToLocalStorage();
    }
  }

  public arrayOf(n: number): number[] {
    return intervalArray(n);
  }
}
