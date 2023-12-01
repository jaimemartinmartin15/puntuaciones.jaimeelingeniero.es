import { InjectionToken, Provider, Type } from '@angular/core';
import { GameService } from './game.service';

export const GAME_SERVICES = new InjectionToken<GameService[]>('GAME_SERVICES token');

export const provideGameService = (service: Type<GameService>): Provider => ({ provide: GAME_SERVICES, useClass: service, multi: true });
