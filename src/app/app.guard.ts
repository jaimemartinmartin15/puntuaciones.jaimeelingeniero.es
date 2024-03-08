import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ROUTING_PATHS } from './constants/routes';
import { LOCAL_STORE_KEYS } from './constants/local-storage-keys';

const isGameInProgress = (): boolean => {
  const lastSavedGameDate = localStorage.getItem(LOCAL_STORE_KEYS.TIME_LAST_INTERACTION);
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
export const appGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (userAlreadyConfirmedResumeGame) {
    return true;
  }

  if (isGameInProgress() && !userAlreadyConfirmedResumeGame) {
    // There is a game in progress, send the user to resume the game. They will confirm yes or no
    userAlreadyConfirmedResumeGame = true;
    return router.createUrlTree([ROUTING_PATHS.RESUME_GAME]);
  }

  // no game in progress, change the flag and send user to configure a new game
  userAlreadyConfirmedResumeGame = true;
  return router.createUrlTree([ROUTING_PATHS.GAME_CONFIG]);
};
