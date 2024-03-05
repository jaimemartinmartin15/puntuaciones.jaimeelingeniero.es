import { Injectable } from '@angular/core';
import { FormArray, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { EnterPlayerNamesModel } from '../components/enter-player-names/enter-player-names.component';
import { LOCAL_STORE_KEYS } from '../constants/local-storage-keys';
import { ROUTING_PATHS, RoutingPath } from '../constants/routes';
import { Player } from '../interfaces/player';
import { Flag } from './flags';
import { GameServiceWithFlags } from './game.service';

const otherGameFlags = ['gameConfig:winner', 'ranking', 'scoreboard', 'statistics', 'statistics:progressGraph'] as const;

type OtherGameFlags = (typeof otherGameFlags)[number];

@Injectable()
export class OtherGameService implements GameServiceWithFlags<OtherGameFlags> {
  private readonly formatter = new Intl.ListFormat('es', { style: 'long', type: 'conjunction' });
  private readonly teamName = 'Jugadores';

  public constructor(private readonly fb: NonNullableFormBuilder) {}

  public readonly flags: Flag[] = otherGameFlags as any as OtherGameFlags[];
  public hasFlagActive(flag: Flag) {
    return this.flags.includes(flag);
  }

  public readonly gameName = 'Otro juego';

  public readonly allowEditTeamName = [false];

  public teamControls: FormArray<FormControl<EnterPlayerNamesModel>> = this.fb.array([
    { teamName: this.teamName, playerNames: ['', '', '', ''], dealingPlayerIndex: 0 },
  ]);

  public saveStateToLocalStorage(): void {
    localStorage.setItem(
      LOCAL_STORE_KEYS.SETTINGS(this.gameName),
      JSON.stringify({
        winner: this.winner,
        dealingPlayerIndex: this.dealingPlayerIndex,
        players: this.players,
      })
    );
  }

  public loadStateFromLocalStorage(): void {
    const settings = JSON.parse(localStorage.getItem(LOCAL_STORE_KEYS.SETTINGS(this.gameName))!);
    this.winner = settings.winner;
    this.winnerFormControl.setValue(this.winner);
    this.dealingPlayerIndex = settings.dealingPlayerIndex;
    this.players = settings.players;
    this.teamControls.setValue([
      { teamName: this.teamName, playerNames: this.players.map((p) => p.name), dealingPlayerIndex: this.dealingPlayerIndex },
    ]);
  }

  public isGameConfigCorrect(): boolean {
    return this.teamControls.controls[0].value.playerNames.every((p) => p.trim() !== '');
  }

  public onStartGame(): void {
    this.winner = this.winnerFormControl.value;
    this.dealingPlayerIndex = this.teamControls.controls[0].value.dealingPlayerIndex;
    this.players = this.teamControls.controls[0].value.playerNames.map((name, id) => ({ id, name: name.trim(), scores: [], punctuation: 0 }));
  }

  public onEditConfigCurrentGame(): void {
    this.winner = this.winnerFormControl.value;

    this.dealingPlayerIndex = this.teamControls.controls[0].value.dealingPlayerIndex;
    this.players = this.teamControls.controls[0].value.playerNames.map((name, id) => {
      // check if it is an existing player by name and change its id, or create a new one with same number of scores
      const existingPlayer = this.players.find((p) => p.name === name.trim());
      const numberOfRounds = this.getNextRoundNumber() - 1;
      return existingPlayer ? { ...existingPlayer, id } : { id, name: name.trim(), scores: new Array(numberOfRounds).fill(0), punctuation: 0 };
    });
  }

  public readonly startGameRoute: RoutingPath = ROUTING_PATHS.RANKING;

  public readonly enterScoreRoute: RoutingPath = ROUTING_PATHS.ENTER_SCORE;

  public gameHasStarted(): boolean {
    return this._players[0].scores.length > 0;
  }

  public gameHasFinished(): boolean {
    return false;
  }

  public getNextRoundNumber(): number {
    return this._players[0].scores.length + 1;
  }

  public getPlayerNameThatDeals(): string {
    return this.players[this.dealingPlayerIndex].name;
  }

  private _players: Player[];

  public get players(): Player[] {
    return [...this._players];
  }

  public set players(value: Player[]) {
    this._players = value;
  }

  public dealingPlayerIndex = 0;

  public setNextDealingPlayer() {
    this.dealingPlayerIndex++;
    if (this.dealingPlayerIndex >= this.players.length) {
      this.dealingPlayerIndex = 0;
    }
    this.teamControls.controls[0].setValue({
      teamName: this.teamName,
      dealingPlayerIndex: this.dealingPlayerIndex,
      playerNames: this.players.map((p) => p.name),
    });
  }

  // * flag -> gameConfig:winner
  public winner: 'highestScore' | 'lowestScore' = 'highestScore' as const;

  public winnerFormControl = this.fb.control(this.winner);

  // * flag -> ranking
  public getRankingPlayers(round: number = this.getNextRoundNumber() - 1): Player[] {
    const totalScores = this.players.map((p) => this.getTotalScore(p.id, round));
    return this.players.sort((p1, p2) =>
      this.winner === 'highestScore' ? totalScores[p2.id] - totalScores[p1.id] : totalScores[p1.id] - totalScores[p2.id]
    );
  }

  public getPlayerPosition(playerId: number, round = this.getNextRoundNumber() - 1): number {
    const accumulatedScores = this.players.map((p) => p.scores.slice(0, round).reduce((acc, current) => acc + current), 0);
    const accumulatedScoresSorted = [...accumulatedScores].sort((n1, n2) => (this.winner === 'highestScore' ? n2 - n1 : n1 - n2));
    return accumulatedScoresSorted.indexOf(accumulatedScores[playerId]) + 1;
  }

  public getScoreLastRound(playerId: number): number {
    const lastRoundIndex = this._players[playerId].scores.length - 1;
    return this._players[playerId].scores[lastRoundIndex];
  }

  public getPlayerName(playerId: number): string {
    return this._players[playerId].name;
  }

  public getTotalScore(playerId: number, round: number = this.getNextRoundNumber() - 1): number {
    return this.players[playerId].scores.slice(0, round).reduce((acc, current) => acc + current, 0);
  }

  // * flag -> scoreboard
  public getPlayerAccumulatedScoreAtRound(playerId: number, round: number): number {
    return this._players[playerId].scores.slice(0, round + 1).reduce((prev, current) => prev + current, 0);
  }

  public getCellBackgroundColor(): string {
    return '#FFF';
  }

  // getTotalScore is already part of ranking flag

  // * flag -> statistics
  public readonly showProgressGraph = true;

  public getPlayersInFirstPosition(): string {
    const players = this.players;
    const positions = players.map((p) => this.getPlayerPosition(p.id));
    const winners = positions
      .reduce((winners, position, playerId) => [...winners, { position, name: players[playerId].name }], [] as { position: number; name: string }[])
      .filter((v) => v.position === 1)
      .map((v) => v.name);
    return this.formatter.format(winners);
  }

  public getPlayersInLastPosition(): string {
    const players = this.players;
    const positions = players.map((p) => this.getPlayerPosition(p.id));
    const lastPosition = Math.max(...positions);
    const losers = positions
      .reduce((winners, position, playerId) => [...winners, { position, name: players[playerId].name }], [] as { position: number; name: string }[])
      .filter((v) => v.position === lastPosition)
      .map((v) => v.name);
    return this.formatter.format(losers);
  }

  public getMaximumScoreInOneRound(): number {
    return Math.max(...this.players.flatMap((p) => p.scores));
  }

  public getPlayerNamesWithMaximumScoreInOneRound(): string {
    const maxScore = this.getMaximumScoreInOneRound();
    const players = this.players.filter((p) => p.scores.includes(maxScore)).map((p) => p.name);
    return this.formatter.format(players);
  }

  public getMinimumScoreInOneRound(): number {
    return Math.min(...this.players.flatMap((p) => p.scores));
  }

  public getPlayerNamesWithMinimumScoreInOneRound(): string {
    const minScore = this.getMinimumScoreInOneRound();
    const players = this.players.filter((p) => p.scores.includes(minScore)).map((p) => p.name);
    return this.formatter.format(players);
  }

  // * flag -> statistics:progressGraph
  public readonly svgWidth = 300;

  public readonly svgHeight = 200;

  public getSvgPlayerLine(player: Player): string {
    let path = `M 0,${this.svgXAxisHeight}`;

    const minimumScore = Math.min(...this.players.map((p) => this.getMinimumReachedScore(p.id)));
    const maximumScore = Math.max(...this.players.map((p) => this.getMaximumReachedScore(p.id)));
    const svgRoundWidth = this.svgWidth / (this.getNextRoundNumber() - 1);

    player.scores
      .map((_, r) => this.getPlayerAccumulatedScoreAtRound(player.id, r))
      .forEach((score, round) => {
        const pointX = svgRoundWidth * (round + 1);
        const pointY = this.svgHeight * ((score - minimumScore) / (maximumScore - minimumScore));
        path += ` ${pointX},${pointY}`;
      });

    return path;
  }

  public get svgXAxisHeight(): number {
    const minimumScore = Math.min(...this.players.map((p) => this.getMinimumReachedScore(p.id)));
    const maximumScore = Math.max(...this.players.map((p) => this.getMaximumReachedScore(p.id)));

    return this.svgHeight * (-minimumScore / (maximumScore - minimumScore)) || 0.5;
  }

  // getTotalScore is already part of ranking flag
  // getRankingPlayers is already part of ranking flag
  // getPlayerPosition is already part of ranking flag

  // * others - helpers

  private getMaximumReachedScore(playerId: number): number {
    const accumulatedScoresAtRounds = this.players[playerId].scores.reduce((prev, current, index) => [...prev, prev[index] + current], [0]);
    return Math.max(...accumulatedScoresAtRounds);
  }

  private getMinimumReachedScore(playerId: number): number {
    const accumulatedScoresAtRounds = this.players[playerId].scores.reduce((prev, current, index) => [...prev, prev[index] + current], [0]);
    return Math.min(...accumulatedScoresAtRounds);
  }
}
