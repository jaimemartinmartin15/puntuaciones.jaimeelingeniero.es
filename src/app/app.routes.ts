import { Type } from '@angular/core';
import { Data, Routes } from '@angular/router';
import { appGuard } from './app.guard';
import { ROUTING_PATHS } from './constants/routes';
import { BriscaComponent } from './views/brisca/brisca.component';
import { EnterScoreBriscaComponent } from './views/enter-score-brisca/enter-score-brisca.component';
import { EnterScorePochaComponent } from './views/enter-score-pocha/enter-score-pocha.component';
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
    canActivateChild: [appGuard],
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
        path: ROUTING_PATHS.ENTER_SCORE_POCHA,
        children: pathWithoutChildrens(EnterScorePochaComponent),
      },
      {
        path: ROUTING_PATHS.ENTER_SCORE_BRISCA,
        children: pathWithoutChildrens(EnterScoreBriscaComponent),
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
        path: ROUTING_PATHS.BRISCA,
        children: pathWithoutChildrens(BriscaComponent),
      },
      {
        path: '**',
        redirectTo: ROUTING_PATHS.GAME_CONFIG,
      },
    ],
  },
];
