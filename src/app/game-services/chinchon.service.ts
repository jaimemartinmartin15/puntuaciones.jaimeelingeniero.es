import { Injectable } from '@angular/core';
import { Player } from '../player';
import { GameService } from './game.service';

@Injectable()
export class ChinchonService implements GameService {
  private readonly svgLimitScoreMargin = 5;
  public readonly gameName = 'Chinchón';

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
  public limitScore = 100;
  public winner: 'highestScore' | 'lowestScore'; // ignored

  public showNumberOfCardsConfig = false;
  public showLimitScoreConfig = true;
  public showWinnerConfig = false;

  public showGameNameInfo = true;
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
  public showNumberOfCardsToDealNextRound = false;
  public getNumberOfCardsToDealNextRound(): string {
    throw new Error('Chinchón game does not support number of cards to deal. It is always 7.');
  }
  public showLimitScoreInfo = true;

  public getPlayerPosition(playerId: number, round = this.getNextRoundNumber() - 1): number {
    const totalScores = this.players.map((p) => this.getTotalScore(p.id, round));
    const totalScoresSorted = [...totalScores].sort((n1, n2) => n1 - n2);
    return totalScoresSorted.indexOf(totalScores[playerId]) + 1;
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
  public getScoreLastRound(playerId: number): number {
    const lastRoundIndex = this._players[playerId].scores.length - 1;
    return this._players[playerId].scores[lastRoundIndex];
  }
  public showMaximumReachedScorePlayerDisplay = false;
  public getMaximumReachedScore(playerId: number): number {
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
  public getMinimumReachedScore(playerId: number): number {
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
  public showNumberOfRejoinsPlayerDisplay = true;
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

  public getRankingPlayers(round: number = this.getNextRoundNumber() - 1): Player[] {
    const totalScores = this.players.map((p) => this.getTotalScore(p.id, round));
    const rejoins = this.players.map((p) => this.getNumberOfRejoins(p.id, round));
    return this.players.sort((p1, p2) => totalScores[p1.id] - totalScores[p2.id] || rejoins[p1.id] - rejoins[p2.id]);
  }
  public gameHasStarted(): boolean {
    return this._players[0].scores.length > 0;
  }

  public getCellBackgroundColor(score: number): string {
    return `background-color: ${score > 0 ? '#f8c8c8' : '#b3ffb3'}`;
  }
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

  public readonly showProgressGraph = true;
  public readonly svgWidth = 300;
  public readonly svgHeight = 200;
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
  public get svgXAxisHeight(): number {
    const minimumScore = Math.min(...this.players.map((p) => this.getMinimumReachedScore(p.id)));
    const maximumScore = Math.max(...this.players.map((p) => this.getMaximumReachedScore(p.id)), this.limitScore + this.svgLimitScoreMargin);

    return this.svgHeight * (-minimumScore / (maximumScore - minimumScore)) || 0.5;
  }
  readonly showSvgLimitScore = true;
  get svgLimitScoreHeight(): number {
    const minimumScore = Math.min(...this.players.map((p) => this.getMinimumReachedScore(p.id)));
    const maximumScore = Math.max(...this.players.map((p) => this.getMaximumReachedScore(p.id)), this.limitScore + this.svgLimitScoreMargin);

    return this.svgHeight * ((this.limitScore - minimumScore) / (maximumScore - minimumScore));
  }
}
