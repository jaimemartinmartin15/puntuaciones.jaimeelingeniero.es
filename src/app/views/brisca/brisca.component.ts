import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BottomControlsComponent } from '../../components/bottom-controls/bottom-controls.component';
import { RoundInfoComponent } from '../../components/round-info/round-info.component';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { BriscaService } from '../../game-services/brisca.service';
import { GameHolderService } from '../../game-services/game-holder.service';
import { intervalArray } from '../../utils/arrays';

interface PlayerInfo {
  name: string;
  score: number;
  deletePointProgress: number;
}

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
  public briscaService: BriscaService;

  public constructor(gameHolderService: GameHolderService) {
    if (!(gameHolderService.service instanceof BriscaService)) {
      throw new Error('Cannot load Brisca component because game holder service does not contain a BriscaService');
    }

    this.briscaService = gameHolderService.service;
  }

  public ngOnInit(): void {
    this.checkShowDeleteBanner();

    let names: string[] = [];
    if (this.briscaService.modality === 'individual') {
      names = this.briscaService.playerNames;
    } else if (this.briscaService.modality === 'teams') {
      names = this.briscaService.teamNames;
    }

    this.playersInfo = names.map((name, i) => {
      return {
        name,
        score: this.briscaService.scores[i],
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
      this.briscaService.scores[playerIndex]--;

      this.briscaService.setPreviousDealingPlayerIndex();
      this.briscaService.saveStateToLocalStorage();
    }
  }

  public arrayOf(n: number): number[] {
    return intervalArray(n);
  }
}
