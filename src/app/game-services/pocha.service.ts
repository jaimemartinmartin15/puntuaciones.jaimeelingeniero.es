import { Injectable } from '@angular/core';
import { FormArray, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { EnterPlayerNamesModel } from '../components/enter-player-names/enter-player-names.component';
import { LOCAL_STORE_KEYS } from '../constants/local-storage-keys';
import { ROUTING_PATHS, RoutingPath } from '../constants/routes';
import { EnterScoreInput } from '../shared/enter-score/EnterScoreInput';
import { Flag } from './flags';
import { GameServiceWithFlags } from './game.service';

const pochaFlags = [
  'game:gameStartEnd',
  'game:localStorageSave',
  'game:rounds',
  'resumeGame:gameName',
  'gameConfig',
  'gameConfig:validation',
  'gameConfig:players',
  'gameConfig:numberOfCards',
  'roundInfo:gameName',
  'roundInfo:dealingPlayer',
  'roundInfo:numberOfCards',
  'bottomControls:changeViews',
  'bottomControls:newRound',
  'bottomControls:newRound:state',
  'ranking',
  'ranking:playerDisplay',
  'ranking:playerDisplay:maximumReachedScore',
  'scoreboard',
  'statistics',
  'statistics:progressGraph',
  'enterScore',
  'enterScore:pocha',
] as const;

type PochaFlags = (typeof pochaFlags)[number];

@Injectable()
export class PochaService implements GameServiceWithFlags<PochaFlags> {
  private readonly formatter = new Intl.ListFormat('es', { style: 'long', type: 'conjunction' });
  private readonly teamName = 'Jugadores';
  private dealingPlayerIndex = 0;
  private scores: number[][] = [];

  public constructor(private readonly fb: NonNullableFormBuilder) {}

  //#region GameService

  public readonly gameName = 'Pocha';

  public readonly startGameRoute: RoutingPath = ROUTING_PATHS.RANKING;

  public readonly flags: Flag[] = pochaFlags as any as PochaFlags[];

  public hasFlagActive(flag: Flag) {
    return this.flags.includes(flag);
  }

  public isGameServiceWithFlags(flags: Flag[]) {
    return flags.every((f) => this.hasFlagActive(f));
  }

  //#endregion GameService

  //#region game:gameStartEnd

  public gameHasStarted(): boolean {
    return this.scores[0].length > 0;
  }

  public gameHasFinished(): boolean {
    return this.getNextRoundNumber() > (this.numberOfCards / this.playerNames.length - 1) * 2 + this.playerNames.length + 1;
  }

  //#endregion game:gameStartEnd

  //#region game:localStorageSave

  public saveStateToLocalStorage(): void {
    localStorage.setItem(
      LOCAL_STORE_KEYS.SETTINGS(this.gameName),
      JSON.stringify({
        numberOfCards: this.numberOfCards,
        dealingPlayerIndex: this.dealingPlayerIndex,
        playerNames: this.playerNames,
        scores: this.scores,
      })
    );
  }

  public loadStateFromLocalStorage(): void {
    const settings = JSON.parse(localStorage.getItem(LOCAL_STORE_KEYS.SETTINGS(this.gameName))!);
    this.numberOfCards = settings.numberOfCards;
    this.numberOfCardsFormControl.setValue(this.numberOfCards);
    this.playerNames = settings.playerNames;
    this.dealingPlayerIndex = settings.dealingPlayerIndex;
    this.teamControls.setValue([{ teamName: this.teamName, playerNames: this.playerNames, dealingPlayerIndex: this.dealingPlayerIndex }]);
    this.scores = settings.scores;
  }

  //#endregion game:localStorageSave

  //#region game:rounds

  public getNextRoundNumber(): number {
    return this.scores[0].length + 1;
  }

  //#endregion game:rounds

  //#region resumeGame:gameName

  // gameName: string -> property already declared by GameService

  //#endregion resumeGame:gameName

  //#region gameConfig

  public onStartGame(): void {
    this.numberOfCards = this.numberOfCardsFormControl.value;
    this.dealingPlayerIndex = this.teamControls.controls[0].value.dealingPlayerIndex;
    this.playerNames = this.teamControls.controls[0].value.playerNames.map((pn) => pn.trim());
    this.scores = this.playerNames.map((_) => new Array());
  }

  public onEditConfigCurrentGame(): void {
    this.numberOfCards = this.numberOfCardsFormControl.value;

    this.dealingPlayerIndex = this.teamControls.controls[0].value.dealingPlayerIndex;

    const newPlayersAndScores = this.teamControls.controls[0].value.playerNames
      .map((n) => n.trim())
      .map((newName) => {
        const existingPlayer = this.playerNames.find((pn) => pn === newName);

        if (existingPlayer) {
          // if it is an existing player, return the same name with existing scores
          const oldPlayerId = this.getPlayerId(newName);
          return { playerName: newName, scores: this.scores[oldPlayerId] };
        }

        // if it is a new player, return the new name with scores initialized to 0
        return { playerName: newName, scores: new Array(this.scores[0].length).fill(0) };
      });

    this.playerNames = newPlayersAndScores.map((e) => e.playerName);
    this.scores = newPlayersAndScores.map((e) => e.scores);
  }

  //#endregion gameConfig

  //#region gameConfig:validation

  public isGameConfigCorrect(): boolean {
    return this.teamControls.controls[0].value.playerNames.every((p) => p.trim() !== '') && this.numberOfCardsFormControl.value > 1;
  }

  //#endregion gameConfig:validation

  //#region gameConfig:players

  public allowEditTeamName = [false];

  public teamControls: FormArray<FormControl<EnterPlayerNamesModel>> = this.fb.array([
    { teamName: this.teamName, playerNames: ['', '', '', ''], dealingPlayerIndex: 0 },
  ]);

  //#endregion gameConfig:players

  //#region gameConfig:numberOfCards

  public numberOfCards = 40;

  public numberOfCardsFormControl = this.fb.control(this.numberOfCards);

  //#endregion gameConfig:numberOfCards

  //#region roundInfo:gameName

  // gameName: string -> property already declared by GameService

  //#endregion roundInfo:gameName

  //#region roundInfo:dealingPlayer

  public getPlayerNameThatDeals(): string {
    return this.playerNames[this.dealingPlayerIndex];
  }

  //#endregion roundInfo:dealingPlayer

  //#region roundInfo:numberOfCards

  public getNumberOfCardsToDealNextRound(): string {
    const cardsDividedPlayers = Math.floor(this.numberOfCards / this.playerNames.length);

    if (this.getNextRoundNumber() <= cardsDividedPlayers) {
      return `${this.getNextRoundNumber()}`;
    }

    if (this.getNextRoundNumber() < cardsDividedPlayers + this.playerNames.length) {
      return `${cardsDividedPlayers}`;
    }

    const cardsToDeal = Math.floor(cardsDividedPlayers - (this.getNextRoundNumber() - cardsDividedPlayers - this.playerNames.length) - 1);
    return cardsToDeal === 0 ? '1 (frente)' : `${cardsToDeal}`;
  }

  //#endregion roundInfo:numberOfCards

  //#region bottomControls:changeViews

  public readonly changeViews = [
    { path: ROUTING_PATHS.RANKING, display: '🥇 Ranking' },
    { path: ROUTING_PATHS.SCOREBOARD, display: '📋 Tabla' },
    { path: ROUTING_PATHS.STATISTICS, display: '📊 Estadísticas' },
  ];

  //#endregion bottomControls:changeViews

  //#region bottomControls:newRound

  public readonly enterScoreRoute: RoutingPath = ROUTING_PATHS.ENTER_SCORE_POCHA;

  //#endregion bottomControls:newRound

  //#region bottomControls:newRound:state

  public getStateEnterNewRound(): EnterScoreInput {
    return {
      playerNames: this.playerNames,
      punctuations: this.playerNames.map(() => 5),
      roundNumber: this.getNextRoundNumber(),
    };
  }

  //#endregion bottomControls:newRound:state

  //#region ranking

  public getRankingPlayers(round: number = this.getNextRoundNumber() - 1): number[] {
    const totalScores = this.playerNames.map((_, id) => this.getTotalScore(id, round));
    const maximumReachedScores = this.playerNames.map((_, id) => this.getMaximumReachedScore(id, round));
    return [...this.playerNames]
      .sort(
        (p1, p2) =>
          totalScores[this.playerNames.indexOf(p2)] - totalScores[this.playerNames.indexOf(p1)] ||
          maximumReachedScores[this.playerNames.indexOf(p2)] - maximumReachedScores[this.playerNames.indexOf(p1)]
      )
      .map((playerName) => this.getPlayerId(playerName));
  }

  //#endregion ranking

  //#region ranking:playerDisplay

  public getPlayerPosition(playerId: number, round = this.getNextRoundNumber() - 1): number {
    const accumulatedScores = this.playerNames.map((_, id) => this.getTotalScore(id, round));
    const accumulatedScoresSorted = [...accumulatedScores].sort((n1, n2) => n2 - n1);
    return accumulatedScoresSorted.indexOf(accumulatedScores[playerId]) + 1;
  }

  public getPlayerName(playerId: number): string {
    return this.playerNames[playerId];
  }

  /**
   * round 0 -> 0
   * round 1 -> scores[playerId][0]
   * round 2 -> scores[playerId][0] + scores[playerId][1]
   * ...
   *
   * By default returns the score after last played round
   */
  public getTotalScore(playerId: number, round: number = this.scores[playerId].length): number {
    return this.scores[playerId].slice(0, round).reduce((acc, current) => acc + current, 0);
  }

  public getScoreLastRound(playerId: number): number {
    const lastRoundIndex = this.scores[playerId].length - 1;
    return this.scores[playerId][lastRoundIndex];
  }

  // enterScoreRoute: RoutingPath -> property already declared by bottomControls:newRound

  //#endregion ranking:playerDisplay

  //#region ranking:playerDisplay:maximumReachedScore

  public getMaximumReachedScore(playerId: number, round = this.getNextRoundNumber() - 1): number {
    const accumulatedScoresAtRounds = this.scores[playerId].slice(0, round).reduce((prev, current, index) => [...prev, prev[index] + current], [0]);
    return Math.max(...accumulatedScoresAtRounds);
  }

  //#endregion ranking:playerDisplay:maximumReachedScore

  //#region scoreboard

  // enterScoreRoute: RoutingPath -> property already declared by bottomControls:newRound

  public playerNames: string[] = [];

  public getPlayerScore(playerId: number, round: number = this.getNextRoundNumber() - 1) {
    return this.scores[playerId][round];
  }

  //  getTotalScore: (playerId: number, round?: number) => number -> property already declared by ranking:playerDisplay

  public getCellBackgroundColor(score: number): string {
    const maximumScoreInOneRound = Math.max(...this.scores.flatMap((scores) => scores));
    const minimumScoreInOneRound = Math.min(...this.scores.flatMap((scores) => scores));
    if (score >= 0) {
      const scorePercentile = score / maximumScoreInOneRound;
      const threshold = 255 - 180 * scorePercentile;
      return `background-color: rgb(${threshold}, 255, ${threshold})`;
    } else {
      const scorePercentile = Math.abs(score) / Math.abs(minimumScoreInOneRound);
      const threshold = 255 - 180 * scorePercentile;
      return `background-color: rgb(255, ${threshold}, ${threshold})`;
    }
  }

  //#endregion scoreboard

  //#region statistics

  public getPlayersInFirstPosition(): string {
    const positions = this.playerNames.map((_, id) => this.getPlayerPosition(id));
    const winners = positions
      .reduce(
        (winners, position, playerId) => [...winners, { position, name: this.playerNames[playerId] }],
        [] as { position: number; name: string }[]
      )
      .filter((v) => v.position === 1)
      .map((v) => v.name);
    return this.formatter.format(winners);
  }

  public getPlayersInLastPosition(): string {
    const positions = this.playerNames.map((_, id) => this.getPlayerPosition(id));
    const lastPosition = Math.max(...positions);
    const losers = positions
      .reduce(
        (winners, position, playerId) => [...winners, { position, name: this.playerNames[playerId] }],
        [] as { position: number; name: string }[]
      )
      .filter((v) => v.position === lastPosition)
      .map((v) => v.name);
    return this.formatter.format(losers);
  }

  public getMaximumScoreInOneRound(): number {
    return Math.max(...this.scores.flatMap((scores) => scores));
  }

  public getPlayerNamesWithMaximumScoreInOneRound(): string {
    const maxScore = this.getMaximumScoreInOneRound();
    const players = this.playerNames.filter((p, id) => this.scores[id].includes(maxScore));
    return this.formatter.format(players);
  }

  public getMinimumScoreInOneRound(): number {
    return Math.min(...this.scores.flatMap((scores) => scores));
  }

  public getPlayerNamesWithMinimumScoreInOneRound(): string {
    const minScore = this.getMinimumScoreInOneRound();
    const players = this.playerNames.filter((_, id) => this.scores[id].includes(minScore));
    return this.formatter.format(players);
  }

  //#endregion statistics

  //#region statistics:progressGraph

  public readonly svgWidth = 300;

  public readonly svgHeight = 200;

  public getSvgPlayerLine(playerId: number): string {
    let path = `M 0,${this.svgXAxisHeight}`;

    const minimumScore = Math.min(...this.playerNames.map((_, id) => this.getMinimumReachedScore(id)));
    const maximumScore = Math.max(...this.playerNames.map((_, id) => this.getMaximumReachedScore(id)));
    const svgRoundWidth = this.svgWidth / (this.getNextRoundNumber() - 1);

    this.scores[playerId]
      .map((_, round) => this.getTotalScore(playerId, round + 1))
      .forEach((score, round) => {
        const pointX = svgRoundWidth * (round + 1);
        const pointY = this.svgHeight * ((score - minimumScore) / (maximumScore - minimumScore));
        path += ` ${pointX},${pointY}`;
      });

    return path;
  }

  public get svgXAxisHeight(): number {
    const minimumScore = Math.min(...this.scores.map((_, id) => this.getMinimumReachedScore(id)));
    const maximumScore = Math.max(...this.scores.map((_, id) => this.getMaximumReachedScore(id)));

    return this.svgHeight * (-minimumScore / (maximumScore - minimumScore)) || 0.5;
  }

  // playerNames: string[] -> property already declared by scoreboard

  // getNextRoundNumber: () => number -> property already declared by game:rounds

  // getRankingPlayers(round: number): number[] -> property already declared by ranking

  // getPlayerName: (playerId: number) => string -> property already declared by ranking:playerDisplay

  // getTotalScore: (playerId: number, round: number) => number -> property already declared by ranking:playerDisplay

  // getPlayerPosition(playerId: number, round: number): number -> property already declared by ranking:playerDisplay

  //#endregion statistics:progressGraph

  //#region enterScore

  // getNextRoundNumber: () => number -> property already declared by game:rounds

  public setNextDealingPlayer() {
    this.dealingPlayerIndex++;
    if (this.dealingPlayerIndex >= this.playerNames.length) {
      this.dealingPlayerIndex = 0;
    }
    this.teamControls.controls[0].setValue({
      teamName: this.teamName,
      dealingPlayerIndex: this.dealingPlayerIndex,
      playerNames: this.playerNames,
    });
  }

  public getPlayerId(playerName: string): number {
    return this.playerNames.indexOf(playerName);
  }

  public setPlayerScore(playerId: number, round: number, score: number) {
    this.scores[playerId][round] = score;
  }

  //#endregion enterScore

  //#region enterScore:pocha

  // playerNames: string[] -> property already declared by scoreboard

  //#endregion enterScore:pocha

  //#region helpers

  private getMinimumReachedScore(playerId: number): number {
    const accumulatedScoresAtRounds = this.scores[playerId].reduce((prev, current, index) => [...prev, prev[index] + current], [0]);
    return Math.min(...accumulatedScoresAtRounds);
  }

  //#endregion helpers
}
