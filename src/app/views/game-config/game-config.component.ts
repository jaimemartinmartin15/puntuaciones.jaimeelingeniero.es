import { DragDropModule } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, pairwise, startWith } from 'rxjs';
import { EnterPlayerNamesComponent } from '../../components/enter-player-names/enter-player-names.component';
import { InputNumberScrollerComponent } from '../../components/input-number-scroller/input-number-scroller.component';
import { RadioButtonGroupModule } from '../../components/radio-button-group/radio-button-group.module';
import { SelectModule } from '../../components/select/select.module';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { GameHolderService } from '../../game-services/game-holder.service';
import { GameService } from '../../game-services/game.service';
import { GAME_SERVICES } from '../../game-services/utils';

@Component({
    selector: 'app-game-config',
    imports: [
    DragDropModule,
    ReactiveFormsModule,

    // Custom form controls
    SelectModule,
    InputNumberScrollerComponent,
    RadioButtonGroupModule,
    EnterPlayerNamesComponent
],
    templateUrl: './game-config.component.html',
    styleUrls: ['./game-config.component.scss']
})
export class GameConfigComponent implements OnInit {
  public isEdition = false;
  public gameService: GameService;
  public selectedGameServiceFormControl: FormControl<GameService>;

  public constructor(
    @Inject(GAME_SERVICES) public gameServices: GameService[],
    private readonly gameHolderService: GameHolderService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly location: Location,
    private readonly fb: NonNullableFormBuilder
  ) {}

  public ngOnInit() {
    this.isEdition = this.activatedRoute.snapshot.data['isEdition'];

    const gameService = this.getGameServiceToLoad();
    this.selectedGameServiceFormControl = this.fb.control(gameService);

    // share player names between game services
    this.selectedGameServiceFormControl.valueChanges.pipe(
      filter(gameService => gameService.hasFlagActive('gameConfig:players')),
      startWith(gameService),
      pairwise()
    ).subscribe(([prevGameService, currentGameService]) => {
      if(currentGameService.hasFlagActive('gameConfig:players') && prevGameService.hasFlagActive('gameConfig:players')) {
        currentGameService.usePlayerNames(prevGameService.getPlayerNames());
      }
    })
  }

  public get selectedGameService(): GameService {
    return this.selectedGameServiceFormControl.value;
  }

  private getGameServiceToLoad(): GameService {
    const savedGameName = localStorage.getItem(LOCAL_STORE_KEYS.SAVED_GAME_NAME);

    if (savedGameName === null || this.isEdition) {
      // if no saved game, it is first time after installing the app this page loads. Return default gameService in gameHolderService
      // if it is edition (edit current game settings), return current game service stored in gameHolderService
      return this.gameHolderService.service;
    }

    // return game service with same settings that was used last time
    const gameService = this.gameServices.find((g) => g.gameName === savedGameName)!;
    if (gameService.hasFlagActive('game:localStorageSave')) {
      gameService.loadStateFromLocalStorage();
    }
    return gameService;
  }

  public startGame() {
    this.gameHolderService.service = this.selectedGameService;

    localStorage.setItem(LOCAL_STORE_KEYS.SAVED_GAME_NAME, this.selectedGameService.gameName);
    localStorage.setItem(LOCAL_STORE_KEYS.TIME_GAME_STARTS, JSON.stringify(Date.now()));
    localStorage.setItem(LOCAL_STORE_KEYS.TIME_LAST_INTERACTION, JSON.stringify(Date.now()));

    if (this.selectedGameService.hasFlagActive('gameConfig')) {
      this.selectedGameService.onStartGame();
    }
    if (this.selectedGameService.hasFlagActive('game:localStorageSave')) {
      this.selectedGameService.saveStateToLocalStorage();
    }

    this.router.navigate(['../', this.selectedGameService.startGameRoute], { relativeTo: this.activatedRoute });
  }

  public editConfigCurrentGame() {
    if (this.selectedGameService.hasFlagActive('gameConfig')) {
      this.selectedGameService.onEditConfigCurrentGame();
    }
    if (this.selectedGameService.hasFlagActive('game:localStorageSave')) {
      this.selectedGameService.saveStateToLocalStorage();
    }
    this.location.back();
  }
}
