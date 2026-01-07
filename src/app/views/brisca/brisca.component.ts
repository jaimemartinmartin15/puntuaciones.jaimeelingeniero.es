import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject, takeUntil } from 'rxjs';
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
export class BriscaComponent implements OnInit, OnDestroy {
  private readonly CLICKS_TO_DELETE_POINT = 5;
  public readonly BULLET_INTERVAL = 5;

  private finishSubscriptions$ = new Subject<void>();

  public playersInfo: PlayerInfo[] = [];
  public showDeleteBanner = true;
  public gameService: GameService & GameServiceWithFlags<(typeof BRISCA_FLAGS)[number]>;
  public playedTime: string;

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

    this.setPlayedTime();
    interval(1000).pipe(takeUntil(this.finishSubscriptions$)).subscribe(() => this.setPlayedTime());
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

  private setPlayedTime() {
    const timeGameStarted = +localStorage.getItem(LOCAL_STORE_KEYS.TIME_GAME_STARTS)!;
    const elapsedSeconds = (Date.now() - timeGameStarted) / 1e3;
    const seconds = Math.trunc(elapsedSeconds % 60);
    const minutes = Math.trunc((elapsedSeconds / 60) % 60);
    const hours = Math.trunc(elapsedSeconds / 3600);
    
    this.playedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    return;
  }

  public ngOnDestroy(): void {
    this.finishSubscriptions$.next();
    this.finishSubscriptions$.complete();
  }
}
