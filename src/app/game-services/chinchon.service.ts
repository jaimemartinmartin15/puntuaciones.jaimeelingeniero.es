import { Injectable } from '@angular/core';
import { FormArray, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { EnterPlayerNamesModel } from '../components/enter-player-names/enter-player-names.component';
import { LOCAL_STORE_KEYS } from '../constants/local-storage-keys';
import { ROUTING_PATHS, RoutingPath } from '../constants/routes';
import { Player } from '../interfaces/player';
import { Flag } from './flags';
import { GameServiceWithFlags } from './game.service';

const chinchonFlags = [
  'resumeGame:gameName',
  'gameConfig:limitScore',
  'roundInfo:gameName',
  'roundInfo:limitScore',
  'ranking',
  'ranking:playerDisplay:numberOfRejoins',
  'scoreboard',
  'scoreboard:specialRounds',
  'statistics',
  'statistics:progressGraph',
  'statistics:progressGraph:limitScore',
] as const;

type ChinchonFlags = (typeof chinchonFlags)[number];

@Injectable()
export class ChinchonService implements GameServiceWithFlags<ChinchonFlags> {
  private readonly formatter = new Intl.ListFormat('es', { style: 'long', type: 'conjunction' });
  private readonly teamName = 'Jugadores';
  private readonly svgLimitScoreMargin = 5;

  public constructor(private readonly fb: NonNullableFormBuilder) {}

  public readonly flags: Flag[] = chinchonFlags as any as ChinchonFlags[];
  public hasFlagActive(flag: Flag) {
    return this.flags.includes(flag);
  }

  public readonly gameName = 'Chinchón';

  public readonly allowEditTeamName = [false];

  public teamControls: FormArray<FormControl<EnterPlayerNamesModel>> = this.fb.array([
    { teamName: this.teamName, playerNames: ['', '', '', ''], dealingPlayerIndex: 0 },
  ]);

  public saveStateToLocalStorage(): void {
    localStorage.setItem(
      LOCAL_STORE_KEYS.SETTINGS(this.gameName),
      JSON.stringify({
        limitScore: this.limitScore,
        dealingPlayerIndex: this.dealingPlayerIndex,
        players: this.players,
      })
    );
  }

  public loadStateFromLocalStorage(): void {
    const settings = JSON.parse(localStorage.getItem(LOCAL_STORE_KEYS.SETTINGS(this.gameName))!);
    this.limitScore = settings.limitScore;
    this.limitScoreFormControl.setValue(this.limitScore);
    this.dealingPlayerIndex = settings.dealingPlayerIndex;
    this.players = settings.players;
    this.teamControls.setValue([
      { teamName: this.teamName, playerNames: this.players.map((p) => p.name), dealingPlayerIndex: this.dealingPlayerIndex },
    ]);
  }

  public isGameConfigCorrect(): boolean {
    return this.teamControls.controls[0].value.playerNames.every((p) => p.trim() !== '') && this.limitScoreFormControl.value > 0;
  }

  public onStartGame(): void {
    this.limitScore = this.limitScoreFormControl.value;
    this.dealingPlayerIndex = this.teamControls.controls[0].value.dealingPlayerIndex;
    this.players = this.teamControls.controls[0].value.playerNames.map((name, id) => ({ id, name: name.trim(), scores: [], punctuation: 0 }));
  }

  public onEditConfigCurrentGame(): void {
    this.limitScore = this.limitScoreFormControl.value;

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
    const numberOfRounds = this.players[0].scores.length;
    const numberOfPlayers = this.players.length;

    let accumulatedScoresAtRound = new Array(this.players.length).fill(0);
    for (let r = 0; r < numberOfRounds; r++) {
      accumulatedScoresAtRound = accumulatedScoresAtRound.map((scoreAcc, p) => scoreAcc + this.players[p].scores[r]);
      const rejoinScore = Math.max(...accumulatedScoresAtRound.filter((s) => s <= this.limitScore));
      const thereIsWinner = accumulatedScoresAtRound.filter((s) => s <= this.limitScore).length <= 1;

      if (thereIsWinner) return true;

      for (let p = 0; p < numberOfPlayers; p++) {
        if (accumulatedScoresAtRound[p] > this.limitScore) {
          accumulatedScoresAtRound[p] = rejoinScore;
        }
      }
    }

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

  // * flag -> resumeGame:gameName
  // gameName is already part of GameService interface

  // * flag -> gameConfig:limitScore
  public limitScore = 100;

  public limitScoreFormControl = this.fb.control(this.limitScore);

  // * flag -> roundInfo:gameName
  // gameName is already part of the GameService interface

  // * flag -> roundInfo:limitScore
  // limitScore is already part of gameConfig:limitScore flag

  // * flag -> ranking
  public getRankingPlayers(round: number = this.getNextRoundNumber() - 1): Player[] {
    const totalScores = this.players.map((p) => this.getTotalScore(p.id, round));
    const rejoins = this.players.map((p) => this.getNumberOfRejoins(p.id, round));
    return this.players.sort((p1, p2) => totalScores[p1.id] - totalScores[p2.id] || rejoins[p1.id] - rejoins[p2.id]);
  }

  public getPlayerPosition(playerId: number, round = this.getNextRoundNumber() - 1): number {
    const totalScores = this.players.map((p) => this.getTotalScore(p.id, round));
    const totalScoresSorted = [...totalScores].sort((n1, n2) => n1 - n2);
    return totalScoresSorted.indexOf(totalScores[playerId]) + 1;
  }

  public getScoreLastRound(playerId: number): number {
    const lastRoundIndex = this._players[playerId].scores.length - 1;
    return this._players[playerId].scores[lastRoundIndex];
  }

  public getPlayerName(playerId: number): string {
    return this._players[playerId].name;
  }

  public getTotalScore(playerId: number, round: number = this.getNextRoundNumber() - 1): number {
    const numberOfPlayers = this.players.length;

    let accumulatedScoresAtRound = new Array(this.players.length).fill(0);
    for (let r = 0; r < round; r++) {
      accumulatedScoresAtRound = accumulatedScoresAtRound.map((scoreAcc, i) => scoreAcc + this.players[i].scores[r]);
      const rejoinScore = Math.max(...accumulatedScoresAtRound.filter((s) => s <= this.limitScore));
      const thereIsWinner = accumulatedScoresAtRound.filter((s) => s <= this.limitScore).length <= 1;

      // reset scores outside limit
      if (!thereIsWinner) {
        for (let p = 0; p < numberOfPlayers; p++) {
          if (accumulatedScoresAtRound[p] > this.limitScore) {
            accumulatedScoresAtRound[p] = rejoinScore;
          }
        }
      }
    }

    return accumulatedScoresAtRound[playerId];
  }

  // * flag -> ranking:playerDisplay:numberOfRejoins
  public getNumberOfRejoins(playerId: number, round = this.getNextRoundNumber() - 1): number {
    const numberOfRejoins = new Array(this.players.length).fill(0);
    const numberOfPlayers = this.players.length;

    let accumulatedScoresAtRound = new Array(this.players.length).fill(0);
    for (let r = 0; r < round; r++) {
      accumulatedScoresAtRound = accumulatedScoresAtRound.map((scoreAcc, i) => scoreAcc + this.players[i].scores[r]);
      const rejoinScore = Math.max(...accumulatedScoresAtRound.filter((s) => s <= this.limitScore));
      const thereIsWinner = accumulatedScoresAtRound.filter((s) => s <= this.limitScore).length <= 1;

      // reset scores outside limit and increment number of rejoins
      if (!thereIsWinner) {
        for (let p = 0; p < numberOfPlayers; p++) {
          if (accumulatedScoresAtRound[p] > this.limitScore) {
            numberOfRejoins[p]++;
            accumulatedScoresAtRound[p] = rejoinScore;
          }
        }
      }
    }

    return numberOfRejoins[playerId];
  }

  // * flag -> scoreboard
  public getPlayerAccumulatedScoreAtRound(playerId: number, round: number): number {
    const numberOfPlayers = this.players.length;

    let accumulatedScoresAtRound = new Array(this.players.length).fill(0);
    for (let r = 0; r < round + 1; r++) {
      accumulatedScoresAtRound = accumulatedScoresAtRound.map((scoreAcc, i) => scoreAcc + this.players[i].scores[r]);
      const rejoinScore = Math.max(...accumulatedScoresAtRound.filter((s) => s <= this.limitScore));
      const thereIsWinner = accumulatedScoresAtRound.filter((s) => s <= this.limitScore).length <= 1;

      // reset scores outside limit
      if (!thereIsWinner) {
        for (let p = 0; p < numberOfPlayers; p++) {
          if (accumulatedScoresAtRound[p] > this.limitScore && r !== round) {
            accumulatedScoresAtRound[p] = rejoinScore;
          }
        }
      }
    }

    return accumulatedScoresAtRound[playerId];
  }

  public getCellBackgroundColor(score: number): string {
    return `background-color: ${score > 0 ? '#f8c8c8' : '#b3ffb3'}`;
  }

  // getTotalScore is already part of ranking flag

  // * flag -> scoreboard:specialRounds
  public showSpecialRowAfterRound(round: number): boolean {
    if (round === this.getNextRoundNumber() - 2 && this.gameHasFinished()) {
      return false;
    }
    return this.getSpecialRoundScores(round).some((score) => score != 0);
  }

  public getSpecialRoundScores(round: number): number[] {
    const numberOfPlayers = this.players.length;

    let accumulatedScoresAtRound = new Array(this.players.length).fill(0);
    let accumulatedScoresAtSpecialRound = new Array(this.players.length).fill(0);
    for (let r = 0; r < round + 1; r++) {
      accumulatedScoresAtRound = accumulatedScoresAtRound.map((scoreAcc, i) => scoreAcc + this.players[i].scores[r]);
      const rejoinScore = Math.max(...accumulatedScoresAtRound.filter((s) => s <= this.limitScore));

      // reset scores outside limit
      for (let p = 0; p < numberOfPlayers; p++) {
        if (accumulatedScoresAtRound[p] > this.limitScore) {
          if (r === round) {
            accumulatedScoresAtSpecialRound[p] = -(accumulatedScoresAtRound[p] - rejoinScore);
          }
          accumulatedScoresAtRound[p] = rejoinScore;
        }
      }
    }

    return accumulatedScoresAtSpecialRound;
  }

  public getPlayerAccumulatedScoreAtSpecialRound(_: number, round: number): number {
    // returns the new score with which the players rejoin

    const numberOfPlayers = this.players.length;
    let rejoinScore: number = 0;

    let accumulatedScoresAtRound = new Array(this.players.length).fill(0);
    for (let r = 0; r < round + 1; r++) {
      accumulatedScoresAtRound = accumulatedScoresAtRound.map((scoreAcc, i) => scoreAcc + this.players[i].scores[r]);
      rejoinScore = Math.max(...accumulatedScoresAtRound.filter((s) => s <= this.limitScore));

      // reset scores outside limit
      for (let p = 0; p < numberOfPlayers; p++) {
        if (accumulatedScoresAtRound[p] > this.limitScore) {
          accumulatedScoresAtRound[p] = rejoinScore;
        }
      }
    }

    return rejoinScore;
  }

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

  public get svgXAxisHeight(): number {
    const minimumScore = Math.min(...this.players.map((p) => this.getMinimumReachedScore(p.id)));
    const maximumScore = Math.max(...this.players.map((p) => this.getMaximumReachedScore(p.id)), this.limitScore + this.svgLimitScoreMargin);

    return this.svgHeight * (-minimumScore / (maximumScore - minimumScore)) || 0.5;
  }

  public getSvgPlayerLine(player: Player): string {
    let path = `M 0,${this.svgXAxisHeight}`;

    const minimumScore = Math.min(...this.players.map((p) => this.getMinimumReachedScore(p.id)));
    const maximumScore = Math.max(...this.players.map((p) => this.getMaximumReachedScore(p.id)), this.limitScore + this.svgLimitScoreMargin);
    const svgRoundWidth = this.svgWidth / (this.getNextRoundNumber() - 1);

    const numberOfPlayers = this.players.length;
    const numberOfRounds = this.getNextRoundNumber() - 1;

    let accumulatedScoresAtRound = new Array(this.players.length).fill(0);
    for (let r = 0; r < numberOfRounds; r++) {
      accumulatedScoresAtRound = accumulatedScoresAtRound.map((scoreAcc, i) => scoreAcc + this.players[i].scores[r]);
      const rejoinScore = Math.max(...accumulatedScoresAtRound.filter((s) => s <= this.limitScore));
      const thereIsWinner = accumulatedScoresAtRound.filter((s) => s <= this.limitScore).length <= 1;

      const pointX = svgRoundWidth * (r + 1);
      const pointY = this.svgHeight * ((accumulatedScoresAtRound[player.id] - minimumScore) / (maximumScore - minimumScore));
      path += ` ${pointX},${pointY}`;

      // reset scores outside limit
      if (!thereIsWinner) {
        for (let p = 0; p < numberOfPlayers; p++) {
          if (accumulatedScoresAtRound[p] > this.limitScore) {
            accumulatedScoresAtRound[p] = rejoinScore;
            const pointX = svgRoundWidth * (r + 1);
            const pointY = this.svgHeight * ((accumulatedScoresAtRound[player.id] - minimumScore) / (maximumScore - minimumScore));
            path += ` ${pointX},${pointY}`;
          }
        }
      }
    }

    return path;
  }

  // getTotalScore is already part of ranking flag
  // getRankingPlayers is already part of ranking flag
  // getRankingPlayers is already part of ranking flag

  // * flag -> statistics:progressGraph:limitScore
  get svgLimitScoreHeight(): number {
    const minimumScore = Math.min(...this.players.map((p) => this.getMinimumReachedScore(p.id)));
    const maximumScore = Math.max(...this.players.map((p) => this.getMaximumReachedScore(p.id)), this.limitScore + this.svgLimitScoreMargin);

    return this.svgHeight * ((this.limitScore - minimumScore) / (maximumScore - minimumScore));
  }

  // * others - helpers

  private getMaximumReachedScore(playerId: number): number {
    const numberOfPlayers = this.players.length;
    const numberOfRounds = this.getNextRoundNumber() - 1;
    let maximumScore = 0;

    let accumulatedScoresAtRound = new Array(this.players.length).fill(0);
    for (let r = 0; r < numberOfRounds; r++) {
      accumulatedScoresAtRound = accumulatedScoresAtRound.map((scoreAcc, i) => scoreAcc + this.players[i].scores[r]);
      const rejoinScore = Math.max(...accumulatedScoresAtRound.filter((s) => s <= this.limitScore));
      const thereIsWinner = accumulatedScoresAtRound.filter((s) => s <= this.limitScore).length <= 1;
      maximumScore = Math.max(maximumScore, accumulatedScoresAtRound[playerId]);

      // reset scores outside limit
      if (!thereIsWinner) {
        for (let p = 0; p < numberOfPlayers; p++) {
          if (accumulatedScoresAtRound[p] > this.limitScore) {
            accumulatedScoresAtRound[p] = rejoinScore;
          }
        }
      }
    }

    return maximumScore;
  }

  private getMinimumReachedScore(playerId: number): number {
    const numberOfPlayers = this.players.length;
    const numberOfRounds = this.getNextRoundNumber() - 1;
    let minimum = 0;

    let accumulatedScoresAtRound = new Array(this.players.length).fill(0);
    for (let r = 0; r < numberOfRounds; r++) {
      accumulatedScoresAtRound = accumulatedScoresAtRound.map((scoreAcc, i) => scoreAcc + this.players[i].scores[r]);
      const rejoinScore = Math.max(...accumulatedScoresAtRound.filter((s) => s <= this.limitScore));
      const thereIsWinner = accumulatedScoresAtRound.filter((s) => s <= this.limitScore).length <= 1;
      minimum = Math.min(minimum, accumulatedScoresAtRound[playerId]);

      // reset scores outside limit
      if (!thereIsWinner) {
        for (let p = 0; p < numberOfPlayers; p++) {
          if (accumulatedScoresAtRound[p] > this.limitScore) {
            accumulatedScoresAtRound[p] = rejoinScore;
          }
        }
      }
    }

    return minimum;
  }
}
