import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { ROUTING_PATHS } from '../../constants/routes';
import { GameHolderService } from '../../game-services/game-holder.service';
import { GameService } from '../../game-services/game.service';
import { GAME_SERVICES } from '../../game-services/utils';

@Component({
    selector: 'app-resume-game',
    templateUrl: './resume-game.component.html',
    styleUrls: ['./resume-game.component.scss']
})
export class ResumeGameComponent implements OnInit {
  public gameService: GameService;

  public constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    @Inject(GAME_SERVICES) private gameServices: GameService[],
    private readonly gameHolderService: GameHolderService
  ) {}

  public ngOnInit() {
    // Note: gameName should not be undefined if this page was loaded
    const gameName = localStorage.getItem(LOCAL_STORE_KEYS.SAVED_GAME_NAME)!.toLowerCase();
    this.gameService = this.gameServices.find((gs) => gs.gameName.toLowerCase() === gameName)!;
  }

  public doNotResumeGame() {
    this.router.navigate(['../', ROUTING_PATHS.GAME_CONFIG], { relativeTo: this.activatedRoute });
  }

  public resumeGame() {
    if (this.gameService.hasFlagActive('game:localStorageSave')) {
      this.gameService.loadStateFromLocalStorage();
    }
    this.gameHolderService.service = this.gameService;

    this.router.navigate(['../', this.gameService.startGameRoute], { relativeTo: this.activatedRoute });
  }
}
