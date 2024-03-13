import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app.routes';
import { BriscaService } from './game-services/brisca.service';
import { ChinchonService } from './game-services/chinchon.service';
import { GameHolderService } from './game-services/game-holder.service';
import { OtherGameService } from './game-services/other-game.service';
import { PochaService } from './game-services/pocha.service';
import { provideGameService } from './game-services/utils';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    GameHolderService,
    provideGameService(PochaService),
    provideGameService(ChinchonService),
    provideGameService(BriscaService),
    provideGameService(OtherGameService),
  ],
};
