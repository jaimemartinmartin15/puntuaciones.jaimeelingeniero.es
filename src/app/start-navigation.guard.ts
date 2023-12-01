import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LOCAL_STORE_KEYS } from './local-storage-keys';
import { ROUTING_PATHS } from './routing-paths';

const isGameInProgress = (): boolean => {
  const lastSavedGameDate = localStorage.getItem(LOCAL_STORE_KEYS.TIME_LAST_GAME);
  const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
  return lastSavedGameDate != null && +lastSavedGameDate > twoHoursAgo;
};

let userAlreadyConfirmedResumeGame = false;

/**
 * On first execution (page load) check if there is game in progress.
 *   If there is game in progress, show RESUME_GAME view. Then user will confirm
 *   If there is no game in progress, go to GAME_CONFIG view
 *
 * On next navigations (only possible through buttons in the app) allow all navigations (user already confirmed resume game)
 */
export const startNavigationGuard: CanActivateFn = (_: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);

  if (userAlreadyConfirmedResumeGame) {
    return true;
  }

  if (isGameInProgress() && !userAlreadyConfirmedResumeGame) {
    userAlreadyConfirmedResumeGame = true; // user will confirm yes or no
    return router.createUrlTree([state.url.split('/')[1], ROUTING_PATHS.RESUME_GAME]);
  }

  userAlreadyConfirmedResumeGame = true; // no game in progress, change the flag
  return router.createUrlTree([state.url.split('/')[1], ROUTING_PATHS.GAME_CONFIG]);
};
