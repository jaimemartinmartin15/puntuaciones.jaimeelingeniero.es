import { Injectable } from '@angular/core';
import { Player } from '../player';
import { GameService } from './game.service';

@Injectable()
export class OtherGameService implements GameService {
  public readonly gameName = 'Otro juego';

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
  }

  public numberOfCards: number; // ignored
  public limitScore: number; // ignored
  public winner: 'highestScore' | 'lowestScore' = 'highestScore';

  public readonly showNumberOfCardsConfig = false;
  public readonly showLimitScoreConfig = false;
  public readonly showWinnerConfig = true;

  public readonly showGameNameInfo = false;
  public gameHasFinished(): boolean {
    return false;
  }
  public getNextRoundNumber(): number {
    return this._players[0].scores.length + 1;
  }
  public getPlayerNameThatDeals(): string {
    return this.players[this.dealingPlayerIndex].name;
  }
  public readonly showNumberOfCardsToDealNextRound = false;
  public getNumberOfCardsToDealNextRound(): string {
    throw new Error('Other game does not support number of cards');
  }
  public readonly showLimitScoreInfo = false;

  public getPlayerPosition(playerId: number, round = this.getNextRoundNumber() - 1): number {
    const accumulatedScores = this.players.map((p) => p.scores.slice(0, round).reduce((acc, current) => acc + current), 0);
    const accumulatedScoresSorted = [...accumulatedScores].sort((n1, n2) => (this.winner === 'highestScore' ? n2 - n1 : n1 - n2));
    return accumulatedScoresSorted.indexOf(accumulatedScores[playerId]) + 1;
  }
  public getPlayerName(playerId: number): string {
    return this._players[playerId].name;
  }
  public getTotalScore(playerId: number, round: number = this.getNextRoundNumber() - 1): number {
    return this.players[playerId].scores.slice(0, round).reduce((acc, current) => acc + current, 0);
  }
  public getScoreLastRound(playerId: number): number {
    const lastRoundIndex = this._players[playerId].scores.length - 1;
    return this._players[playerId].scores[lastRoundIndex];
  }
  public showMaximumReachedScorePlayerDisplay = false;
  public getMaximumReachedScore(playerId: number): number {
    const accumulatedScoresAtRounds = this.players[playerId].scores.reduce((prev, current, index) => [...prev, prev[index] + current], [0]);
    return Math.max(...accumulatedScoresAtRounds);
  }
  public getMinimumReachedScore(playerId: number): number {
    const accumulatedScoresAtRounds = this.players[playerId].scores.reduce((prev, current, index) => [...prev, prev[index] + current], [0]);
    return Math.min(...accumulatedScoresAtRounds);
  }
  public showNumberOfRejoinsPlayerDisplay = false;
  public getNumberOfRejoins(): number {
    throw new Error('Other game does not support rejoins');
  }

  public getRankingPlayers(round: number = this.getNextRoundNumber() - 1): Player[] {
    const totalScores = this.players.map((p) => this.getTotalScore(p.id, round));
    return this.players.sort((p1, p2) =>
      this.winner === 'highestScore' ? totalScores[p2.id] - totalScores[p1.id] : totalScores[p1.id] - totalScores[p2.id]
    );
  }
  public gameHasStarted(): boolean {
    return this._players[0].scores.length > 0;
  }

  public getCellBackgroundColor(): string {
    return '#FFF';
  }
  public getPlayerAccumulatedScoreAtRound(playerId: number, round: number): number {
    return this._players[playerId].scores.slice(0, round + 1).reduce((prev, current) => prev + current, 0);
  }
  public getPlayerAccumulatedScoreAtSpecialRound(): number {
    return 0; // ignored
  }
  public showSpecialRowAfterRound(): boolean {
    return false;
  }
  public getSpecialRoundScores(): number[] {
    return []; // ignored
  }

  public readonly showProgressGraph = true;
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
  readonly showSvgLimitScore = false;
  get svgLimitScoreHeight(): number {
    throw new Error('Other game does not have limit score');
  }
}
