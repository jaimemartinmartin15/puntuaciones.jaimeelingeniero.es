import { FormArray, FormControl } from '@angular/forms';
import { EnterPlayerNamesModel } from '../components/enter-player-names/enter-player-names.component';
import { RoutingPath } from '../constants/routes';

// Note: some flags might have duplicated fields, but because it is required for both

export type FlagMapping = {
  // general for the game
  'game:gameStartEnd': { gameHasStarted: () => boolean; gameHasFinished: () => boolean };
  'game:localStorageSave': {
    saveStateToLocalStorage(): void;
    loadStateFromLocalStorage(): void;
  };
  'game:rounds': {
    getNextRoundNumber: () => number;
  };

  // resume game
  'resumeGame:gameName': { gameName: string };

  // game config
  gameConfig: {
    onStartGame(): void;
    onEditConfigCurrentGame(): void;
  };
  'gameConfig:validation': { isGameConfigCorrect(): boolean };
  'gameConfig:players': { allowEditTeamName: boolean[]; teamControls: FormArray<FormControl<EnterPlayerNamesModel>> };
  'gameConfig:numberOfCards': { numberOfCards: number; numberOfCardsFormControl: FormControl<number> };
  'gameConfig:limitScore': { limitScore: number; limitScoreFormControl: FormControl<number>; numberOfScrollers: number };
  'gameConfig:winner': { winner: 'highestScore' | 'lowestScore'; winnerFormControl: FormControl<'highestScore' | 'lowestScore'> };
  'gameConfig:modality': { modality: 'individual' | 'teams'; modalityFormControl: FormControl<'individual' | 'teams'> };

  // round info
  'roundInfo:gameName': { gameName: string };
  'roundInfo:dealingPlayer': { getPlayerNameThatDeals: () => string };
  'roundInfo:numberOfCards': { getNumberOfCardsToDealNextRound: () => string };
  'roundInfo:limitScore': { limitScore: number };

  // bottom controls
  'bottomControls:changeViews': { changeViews: { path: RoutingPath; display: string }[] };
  'bottomControls:newRound': { enterScoreRoute: RoutingPath };
  'bottomControls:newRound:state': { getStateEnterNewRound(): { [key: string]: any } };

  // raking view
  ranking: {
    getRankingPlayers(round?: number): number[];
  };

  // player display in ranking view
  'ranking:playerDisplay': {
    getPlayerPosition: (playerId: number) => number;
    getPlayerName: (playerId: number) => string;
    getTotalScore: (playerId: number) => number;
    getScoreLastRound: (playerId: number) => number;
    enterScoreRoute: RoutingPath;
  };

  // player display in ranking view (optionals)
  'ranking:playerDisplay:maximumReachedScore': { getMaximumReachedScore: (playerId: number) => number };
  'ranking:playerDisplay:numberOfRejoins': { getNumberOfRejoins: (playerId: number) => number };

  // scoreboard view
  scoreboard: {
    enterScoreRoute: RoutingPath;
    playerNames: string[];
    getPlayerScore: (playerId: number, round?: number) => number;
    getTotalScore: (playerId: number, round?: number) => number;
    getCellBackgroundColor: (score: number) => string;
  };

  // scoreboard view (optionals)
  'scoreboard:specialRounds': {
    showSpecialRowAfterRound: (round: number) => boolean;
    getSpecialRoundScores: (round: number) => number[];
    getPlayerAccumulatedScoreAtSpecialRound: (playerId: number, round: number) => number;
  };

  // statistics view
  statistics: {
    getPlayersInFirstPosition: () => string;
    getPlayersInLastPosition: () => string;
    getMaximumScoreInOneRound: () => number;
    getPlayerNamesWithMaximumScoreInOneRound: () => string;
    getMinimumScoreInOneRound: () => number;
    getPlayerNamesWithMinimumScoreInOneRound: () => string;
  };

  // statistics view (optionals)
  'statistics:progressGraph': {
    svgWidth: number;
    svgHeight: number;
    getSvgPlayerLine: (playerId: number) => string;
    svgXAxisHeight: number;
    playerNames: string[];
    getNextRoundNumber: () => number;
    getRankingPlayers(round: number): number[];
    getPlayerName: (playerId: number) => string;
    getTotalScore: (playerId: number, round: number) => number;
    getPlayerPosition(playerId: number, round: number): number;
  };

  // statistics view progress graph (optionals)
  'statistics:progressGraph:limitScore': {
    svgLimitScoreHeight: number;
  };

  // brisca view
  brisca: {
    modality: 'individual' | 'teams';
    playerNames: string[];
    teamNames: string[];
    scores: number[];
    setPreviousDealingPlayerIndex: () => void;
  };

  // enter score view
  enterScore: {
    getNextRoundNumber: () => number;
    setNextDealingPlayer(): void;
    getPlayerId: (playerName: string) => number;
    setPlayerScore: (playerId: number, round: number, score: number) => void;
  };

  // enter score pocha view
  'enterScore:pocha': {
    playerNames: string[];
  };

  // enter score brisca view
  'enterScore:brisca': {
    modality: 'individual' | 'teams';
    playerNames: string[];
    teamNames: string[];
    scores: number[];
    setNextDealingPlayer(): void;
  };
};

export type Flag = keyof FlagMapping;
