import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ChinchonService } from './game-services/chinchon.service';
import { GameHolderService } from './game-services/game-holder.service';
import { OtherGameService } from './game-services/other-game.service';
import { PochaService } from './game-services/pocha.service';
import { provideGameService } from './game-services/utils';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    GameHolderService,
    provideGameService(PochaService),
    provideGameService(ChinchonService),
    provideGameService(OtherGameService),
  ],
};
