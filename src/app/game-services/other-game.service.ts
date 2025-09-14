import { Injectable } from '@angular/core';
import { FormArray, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { EnterPlayerNamesModel } from '../components/enter-player-names/enter-player-names.component';
import { LOCAL_STORE_KEYS } from '../constants/local-storage-keys';
import { ROUTING_PATHS, RoutingPath } from '../constants/routes';
import { EnterScoreInput } from '../shared/enter-score/EnterScoreInput';
import { Flag } from './flags';
import { GameServiceWithFlags } from './game.service';

const otherGameFlags = [
  'game:gameStartEnd',
  'game:localStorageSave',
  'game:rounds',
  'gameConfig',
  'gameConfig:validation',
  'gameConfig:players',
  'gameConfig:winner',
  'roundInfo:dealingPlayer',
  'bottomControls:changeViews',
  'bottomControls:newRound',
  'bottomControls:newRound:state',
  'ranking',
  'ranking:playerDisplay',
  'scoreboard',
  'statistics',
  'statistics:progressGraph',
  'enterScore',
] as const;

type OtherGameFlags = (typeof otherGameFlags)[number];

@Injectable()
export class OtherGameService implements GameServiceWithFlags<OtherGameFlags> {
  private readonly formatter = new Intl.ListFormat('es', { style: 'long', type: 'conjunction' });
  private readonly teamName = 'Jugadores';
  private dealingPlayerIndex = 0;
  private scores: number[][] = [];

  public constructor(private readonly fb: NonNullableFormBuilder) {}

  //#region GameService

  public readonly gameName = 'Otro juego';

  public readonly startGameRoute: RoutingPath = ROUTING_PATHS.RANKING;

  public readonly flags: Flag[] = otherGameFlags as any as OtherGameFlags[];

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
    return false;
  }

  //#endregion game:gameStartEnd

  //#region game:localStorageSave

  public saveStateToLocalStorage(): void {
    localStorage.setItem(
      LOCAL_STORE_KEYS.SETTINGS(this.gameName),
      JSON.stringify({
        winner: this.winner,
        dealingPlayerIndex: this.dealingPlayerIndex,
        playerNames: this.playerNames,
        scores: this.scores,
      })
    );
  }

  public loadStateFromLocalStorage(): void {
    const settings = JSON.parse(localStorage.getItem(LOCAL_STORE_KEYS.SETTINGS(this.gameName))!);
    this.winner = settings.winner;
    this.winnerFormControl.setValue(this.winner);
    this.playerNames = settings.playerNames;
    this.dealingPlayerIndex = settings.dealingPlayerIndex;
    this.teamControls.setValue([{ teamName: this.teamName, playerNames: [...this.playerNames], dealingPlayerIndex: this.dealingPlayerIndex }]);
    this.scores = settings.scores;
  }

  //#endregion game:localStorageSave

  //#region game:rounds

  public getNextRoundNumber(): number {
    return this.scores[0].length + 1;
  }

  //#endregion game:rounds

  //#region gameConfig

  public onStartGame(): void {
    this.winner = this.winnerFormControl.value;
    this.dealingPlayerIndex = this.teamControls.controls[0].value.dealingPlayerIndex;
    this.playerNames = this.teamControls.controls[0].value.playerNames.map((pn) => pn.trim());
    this.scores = this.playerNames.map((_) => new Array());
  }

  public onEditConfigCurrentGame(): void {
    this.winner = this.winnerFormControl.value;

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
    return this.teamControls.controls[0].value.playerNames.every((p) => p.trim() !== '');
  }

  //#endregion gameConfig:validation

  //#region gameConfig:players

  public readonly allowEditTeamName = [false];

  public teamControls: FormArray<FormControl<EnterPlayerNamesModel>> = this.fb.array([
    { teamName: this.teamName, playerNames: ['', '', '', ''], dealingPlayerIndex: 0 },
  ]);

  public usePlayerNames(playerNames: string[]): void {
    const tempValue = this.teamControls.controls[0].value
    tempValue.playerNames = [...playerNames];
    this.teamControls.controls[0].setValue(tempValue);
  }
  
  public getPlayerNames(): string[] {
    return this.teamControls.controls[0].value.playerNames;
  }

  //#endregion gameConfig:players

  //#region gameConfig:winner

  public winner: 'highestScore' | 'lowestScore' = 'highestScore' as const;

  public winnerFormControl = this.fb.control(this.winner);

  //#endregion gameConfig:winner

  //#region roundInfo:dealingPlayer

  public getPlayerNameThatDeals(): string {
    return this.playerNames[this.dealingPlayerIndex];
  }

  //#endregion roundInfo:dealingPlayer

  //#region bottomControls:changeViews

  public readonly changeViews = [
    { path: ROUTING_PATHS.RANKING, display: '🥇 Ranking' },
    { path: ROUTING_PATHS.SCOREBOARD, display: '📋 Tabla' },
    { path: ROUTING_PATHS.STATISTICS, display: '📊 Estadísticas' },
  ];

  //#endregion bottomControls:changeViews

  //#region bottomControls:newRound

  public readonly enterScoreRoute: RoutingPath = ROUTING_PATHS.ENTER_SCORE;

  //#endregion bottomControls:newRound

  //#region bottomControls:newRound:state

  public getStateEnterNewRound(): EnterScoreInput {
    return {
      playerNames: this.playerNames,
      punctuations: this.playerNames.map(() => 0),
      roundNumber: this.getNextRoundNumber(),
    };
  }

  //#endregion bottomControls:newRound:state

  //#region ranking

  public getRankingPlayers(round: number = this.getNextRoundNumber() - 1): number[] {
    const totalScores = this.playerNames.map((_, id) => this.getTotalScore(id, round));
    return this.playerNames
      .map((pn) => this.getPlayerId(pn))
      .sort((p1, p2) => (this.winner === 'highestScore' ? totalScores[p2] - totalScores[p1] : totalScores[p1] - totalScores[p2]));
  }

  //#endregion ranking

  //#region ranking:playerDisplay

  public getPlayerPosition(playerId: number, round = this.getNextRoundNumber() - 1): number {
    const accumulatedScores = this.playerNames.map((_, playerId) => this.getTotalScore(playerId, round));
    const accumulatedScoresSorted = [...accumulatedScores].sort((n1, n2) => (this.winner === 'highestScore' ? n2 - n1 : n1 - n2));
    return accumulatedScoresSorted.indexOf(accumulatedScores[playerId]) + 1;
  }

  public getPlayerName(playerId: number): string {
    return this.playerNames[playerId];
  }

  public getTotalScore(playerId: number, round: number = this.getNextRoundNumber() - 1): number {
    return this.scores[playerId].slice(0, round).reduce((acc, current) => acc + current, 0);
  }

  public getScoreLastRound(playerId: number): number {
    const lastRoundIndex = this.scores[playerId].length - 1;
    return this.scores[playerId][lastRoundIndex];
  }

  // enterScoreRoute: RoutingPath -> property already declared by bottomControls:newRound

  //#endregion ranking:playerDisplay

  //#region scoreboard

  // enterScoreRoute: RoutingPath -> property already declared by bottomControls:newRound

  public playerNames: string[] = [];

  public getPlayerScore(playerId: number, round: number = this.getNextRoundNumber() - 1): number {
    return this.scores[playerId][round];
  }

  public getPlayerAccumulatedScoreAtRound(playerId: number, round: number): number {
    return this.getTotalScore(playerId, round);
  }

  //  getTotalScore: (playerId: number, round?: number) => number -> property already declared by ranking:playerDisplay

  public getCellBackgroundColor(): string {
    return '#FFF';
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
    const players = this.playerNames.filter((_, id) => this.scores[id].includes(maxScore));
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

    this.scores
      .map((_, round) => this.getTotalScore(playerId, round + 1))
      .forEach((score, round) => {
        const pointX = svgRoundWidth * (round + 1);
        const pointY = this.svgHeight * ((score - minimumScore) / (maximumScore - minimumScore));
        path += ` ${pointX},${pointY}`;
      });

    return path;
  }

  public get svgXAxisHeight(): number {
    const minimumScore = Math.min(...this.playerNames.map((_, id) => this.getMinimumReachedScore(id)));
    const maximumScore = Math.max(...this.playerNames.map((_, id) => this.getMaximumReachedScore(id)));

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
      playerNames: [...this.playerNames],
    });
  }

  public getPlayerId(playerName: string): number {
    return this.playerNames.indexOf(playerName);
  }

  public setPlayerScore(playerId: number, round: number, score: number) {
    this.scores[playerId][round] = score;
  }

  //#endregion enterScore

  //#region helpers

  private getMaximumReachedScore(playerId: number): number {
    const accumulatedScoresAtRounds = this.scores[playerId].reduce((prev, current, index) => [...prev, prev[index] + current], [0]);
    return Math.max(...accumulatedScoresAtRounds);
  }

  private getMinimumReachedScore(playerId: number): number {
    const accumulatedScoresAtRounds = this.scores[playerId].reduce((prev, current, index) => [...prev, prev[index] + current], [0]);
    return Math.min(...accumulatedScoresAtRounds);
  }

  //#endregion helpers
}
