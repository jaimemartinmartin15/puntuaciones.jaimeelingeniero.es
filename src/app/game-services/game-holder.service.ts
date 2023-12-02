import { Inject, Injectable } from '@angular/core';
import { GameService } from './game.service';
import { GAME_SERVICES } from './utils';

@Injectable()
export class GameHolderService {
  public service: GameService;

  public constructor(@Inject(GAME_SERVICES) gameServices: GameService[]) {
    this.service = gameServices[0];
  }
}
