import { Type } from '@angular/core';
import { Data, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ROUTING_PATHS } from './routing-paths';
import { startNavigationGuard } from './start-navigation.guard';
import { EnterScoreComponent } from './views/enter-score/enter-score.component';
import { GameConfigComponent } from './views/game-config/game-config.component';
import { RankingComponent } from './views/ranking/ranking.component';
import { ResumeGameComponent } from './views/resume-game/resume-game.component';
import { ScoreboardComponent } from './views/scoreboard/scoreboard.component';
import { StatisticsComponent } from './views/statistics/statistics.component';

const pathWithoutChildrens = (component: Type<any>, data?: Data): Routes => {
  return [
    {
      path: '',
      component,
      data,
    },
    {
      path: '**',
      redirectTo: '',
    },
  ];
};

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    canActivateChild: [startNavigationGuard],
    children: [
      {
        path: ROUTING_PATHS.RESUME_GAME,
        children: pathWithoutChildrens(ResumeGameComponent),
      },
      {
        path: ROUTING_PATHS.GAME_CONFIG,
        children: pathWithoutChildrens(GameConfigComponent, { isEdition: false }),
      },
      {
        path: ROUTING_PATHS.CHANGE_CONFIG,
        children: pathWithoutChildrens(GameConfigComponent, { isEdition: true }),
      },
      {
        path: ROUTING_PATHS.ENTER_SCORE,
        children: pathWithoutChildrens(EnterScoreComponent),
      },
      {
        path: ROUTING_PATHS.RANKING,
        children: pathWithoutChildrens(RankingComponent),
      },
      {
        path: ROUTING_PATHS.SCOREBOARD,
        children: pathWithoutChildrens(ScoreboardComponent),
      },
      {
        path: ROUTING_PATHS.STATISTICS,
        children: pathWithoutChildrens(StatisticsComponent),
      },
      {
        path: '**',
        redirectTo: ROUTING_PATHS.GAME_CONFIG,
      },
    ],
  },
];
