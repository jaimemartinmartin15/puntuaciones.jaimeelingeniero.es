import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTING_PATHS } from '../../app.routes';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { GameHolderService } from '../../game-services/game-holder.service';
import { GameService } from '../../game-services/game.service';
import { GAME_SERVICES } from '../../game-services/utils';

@Component({
  selector: 'app-resume-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume-game.component.html',
  styleUrls: ['./resume-game.component.scss'],
})
export class ResumeGameComponent implements OnInit {
  public gameName: string;
  public showGameName = true;

  public constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    @Inject(GAME_SERVICES) private gameServices: GameService[],
    private readonly gameHolderService: GameHolderService
  ) {}

  public ngOnInit() {
    // Note: gameName should not be undefined if this page was loaded
    this.gameName = localStorage.getItem(LOCAL_STORE_KEYS.GAME_NAME)!.toLowerCase();
    this.showGameName = this.gameName != undefined && this.gameName != 'otro juego';
  }

  public doNotResumeGame() {
    this.router.navigate(['../', ROUTING_PATHS.GAME_CONFIG], { relativeTo: this.activatedRoute });
  }

  public resumeGame() {
    const gameService = this.gameServices.find((gs) => gs.gameName.toLowerCase() === this.gameName) as GameService;
    this.gameHolderService.service = gameService as GameService; // should not be undefined if this page was loaded

    // load players and scores
    gameService.players = JSON.parse(localStorage.getItem(LOCAL_STORE_KEYS.PLAYERS)!);
    gameService.dealingPlayerIndex = JSON.parse(localStorage.getItem(LOCAL_STORE_KEYS.DEALING_PLAYER_INDEX)!);

    // override configuration from local storage
    const config = JSON.parse(localStorage.getItem(LOCAL_STORE_KEYS.CONFIG)!);
    gameService.numberOfCards = config.numberOfCards;
    gameService.limitScore = config.limitScore;
    gameService.winner = config.winner;

    this.router.navigate(['../', ROUTING_PATHS.RANKING], { relativeTo: this.activatedRoute });
  }
}
