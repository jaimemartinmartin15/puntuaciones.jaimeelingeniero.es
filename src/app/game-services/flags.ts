import { FormControl } from '@angular/forms';
import { RoutingPath } from '../constants/routes';
import { Player } from '../interfaces/player';

// Note: some flags might have duplicated fields, but because it is required for both

export type FlagMapping = {
  // resume game
  'resumeGame:gameName': { gameName: string };

  // game config
  'gameConfig:numberOfCards': { numberOfCards: number; numberOfCardsFormControl: FormControl<number> };
  'gameConfig:limitScore': { limitScore: number; limitScoreFormControl: FormControl<number>; numberOfScrollers: number };
  'gameConfig:winner': { winner: 'highestScore' | 'lowestScore'; winnerFormControl: FormControl<'highestScore' | 'lowestScore'> };
  'gameConfig:modality': { modality: 'individual' | 'teams'; modalityFormControl: FormControl<'individual' | 'teams'> };

  // round info
  'roundInfo:gameName': { gameName: string };
  'roundInfo:numberOfCards': { getNumberOfCardsToDealNextRound: () => string };
  'roundInfo:limitScore': { limitScore: number };

  // bottom controls
  'bottomControls:changeViews': { changeViews: { path: RoutingPath; display: string }[] };

  // raking view
  ranking: {
    getRankingPlayers(round?: number): Player[];
    // required for player display
    getPlayerPosition: (playerId: number) => number;
    getScoreLastRound: (playerId: number) => number;
    getPlayerName: (playerId: number) => string;
    getTotalScore: (playerId: number) => number;
  };

  // player display in ranking view
  'ranking:playerDisplay:maximumReachedScore': { getMaximumReachedScore: (playerId: number) => number };
  'ranking:playerDisplay:numberOfRejoins': { getNumberOfRejoins: (playerId: number) => number };

  // scoreboard view
  scoreboard: {
    getPlayerAccumulatedScoreAtRound: (playerId: number, round: number) => number;
    getCellBackgroundColor: (score: number) => string;
    getTotalScore: (playerId: number) => number;
  };
  'scoreboard:specialRounds': {
    showSpecialRowAfterRound: (round: number) => boolean;
    getSpecialRoundScores: (round: number) => number[];
    getPlayerAccumulatedScoreAtSpecialRound: (playerId: number, round: number) => number;
  };

  // statistics view
  statistics: {
    showProgressGraph: boolean;
    getPlayersInFirstPosition: () => string;
    getPlayersInLastPosition: () => string;
    getMaximumScoreInOneRound: () => number;
    getPlayerNamesWithMaximumScoreInOneRound: () => string;
    getMinimumScoreInOneRound: () => number;
    getPlayerNamesWithMinimumScoreInOneRound: () => string;
  };
  'statistics:progressGraph': {
    svgWidth: number;
    svgHeight: number;
    svgXAxisHeight: number;
    getSvgPlayerLine: (player: Player) => string;
    getTotalScore: (playerId: number, round: number) => number;
    getRankingPlayers(round: number): Player[];
    getPlayerPosition(playerId: number, round: number): number;
  };
  'statistics:progressGraph:limitScore': {
    svgLimitScoreHeight: number;
  };
};

export type Flag = keyof FlagMapping;
