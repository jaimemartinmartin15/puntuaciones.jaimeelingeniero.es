import { Injectable } from '@angular/core';
import { FormArray, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { EnterPlayerNamesModel } from '../components/enter-player-names/enter-player-names.component';
import { LOCAL_STORE_KEYS } from '../constants/local-storage-keys';
import { ROUTING_PATHS, RoutingPath } from '../constants/routes';
import { EnterScoreInput } from '../shared/enter-score/EnterScoreInput';
import { Flag } from './flags';
import { GameServiceWithFlags } from './game.service';

const chinchonFlags = [
  'game:gameStartEnd',
  'game:localStorageSave',
  'game:rounds',
  'resumeGame:gameName',
  'gameConfig',
  'gameConfig:validation',
  'gameConfig:players',
  'gameConfig:limitScore',
  'roundInfo:gameName',
  'roundInfo:dealingPlayer',
  'roundInfo:limitScore',
  'bottomControls:changeViews',
  'bottomControls:newRound',
  'bottomControls:newRound:state',
  'ranking',
  'ranking:playerDisplay',
  'ranking:playerDisplay:numberOfRejoins',
  'scoreboard',
  'scoreboard:specialRounds',
  'statistics',
  'statistics:progressGraph',
  'statistics:progressGraph:limitScore',
  'enterScore',
] as const;

type ChinchonFlags = (typeof chinchonFlags)[number];

@Injectable()
export class ChinchonService implements GameServiceWithFlags<ChinchonFlags> {
  private readonly formatter = new Intl.ListFormat('es', { style: 'long', type: 'conjunction' });
  private readonly teamName = 'Jugadores';
  private dealingPlayerIndex = 0;
  private scores: number[][] = [];
  private readonly svgLimitScoreMargin = 5;

  public constructor(private readonly fb: NonNullableFormBuilder) {}

  //#region GameService

  public readonly gameName = 'Chinchón';

  public readonly startGameRoute: RoutingPath = ROUTING_PATHS.SCOREBOARD;

  public readonly flags: Flag[] = chinchonFlags as any as ChinchonFlags[];

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
    const numberOfRounds = this.scores[0].length;
    const numberOfPlayers = this.playerNames.length;

    let accumulatedScoresAtRound = new Array(numberOfPlayers).fill(0);
    for (let round = 0; round < numberOfRounds; round++) {
      accumulatedScoresAtRound = accumulatedScoresAtRound.map((scoreAcc, playerId) => scoreAcc + this.getPlayerScore(playerId, round));
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

  //#endregion game:gameStartEnd

  //#region game:localStorageSave

  public saveStateToLocalStorage(): void {
    localStorage.setItem(
      LOCAL_STORE_KEYS.SETTINGS(this.gameName),
      JSON.stringify({
        limitScore: this.limitScore,
        dealingPlayerIndex: this.dealingPlayerIndex,
        playerNames: this.playerNames,
        scores: this.scores,
      })
    );
  }

  public loadStateFromLocalStorage(): void {
    const settings = JSON.parse(localStorage.getItem(LOCAL_STORE_KEYS.SETTINGS(this.gameName))!);
    this.limitScore = settings.limitScore;
    this.limitScoreFormControl.setValue(this.limitScore);
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
    this.limitScore = this.limitScoreFormControl.value;
    this.dealingPlayerIndex = this.teamControls.controls[0].value.dealingPlayerIndex;
    this.playerNames = this.teamControls.controls[0].value.playerNames.map((pn) => pn.trim());
    this.scores = this.playerNames.map(() => new Array());
  }

  public onEditConfigCurrentGame(): void {
    this.limitScore = this.limitScoreFormControl.value;

    this.dealingPlayerIndex = this.teamControls.controls[0].value.dealingPlayerIndex;

    const newPlayersAndScores = this.teamControls.controls[0].value.playerNames.map((newName) => {
      const existingPlayer = this.playerNames.find((pn) => pn === newName.trim());

      if (existingPlayer) {
        // if it is an existing player, return the same name with existing scores
        const oldPlayerId = this.getPlayerId(newName.trim());
        return { playerName: newName.trim(), scores: this.scores[oldPlayerId] };
      }

      // if it is a new player, rejoin with highest score (even if that player also leaves the game at the same time)
      const highestScore = Math.max(...this.playerNames.map((_, playerId) => this.getTotalScore(playerId, this.scores[0].length)));
      const scores = new Array(this.scores[0].length).fill(0);
      scores[scores.length - 1] = highestScore;
      return { playerName: newName, scores };
    });

    this.playerNames = newPlayersAndScores.map((e) => e.playerName);
    this.scores = newPlayersAndScores.map((e) => e.scores);
  }

  //#endregion gameConfig

  //#region gameConfig:validation

  public isGameConfigCorrect(): boolean {
    return this.teamControls.controls[0].value.playerNames.every((p) => p.trim() !== '') && this.limitScoreFormControl.value > 0;
  }

  //#endregion gameConfig:validation

  //#region gameConfig:players

  public readonly allowEditTeamName = [false];

  public teamControls: FormArray<FormControl<EnterPlayerNamesModel>> = this.fb.array([
    { teamName: this.teamName, playerNames: ['', '', '', ''], dealingPlayerIndex: 0 },
  ]);

  //#endregion gameConfig:players

  //#region gameConfig:limitScore

  public limitScore = 100;

  public limitScoreFormControl = this.fb.control(this.limitScore);

  public numberOfScrollers = 3;

  //#endregion gameConfig:limitScore

  //#region roundInfo:gameName

  // gameName: string -> property already declared by GameService

  //#endregion roundInfo:gameName

  //#region roundInfo:dealingPlayer

  public getPlayerNameThatDeals(): string {
    return this.playerNames[this.dealingPlayerIndex];
  }

  //#endregion roundInfo:dealingPlayer

  //#region roundInfo:limitScore

  // limitScore: number -> property already declared by gameConfig:limitScore

  //#endregion roundInfo:limitScore

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
    const totalScores = this.playerNames.map((_, playerId) => this.getTotalScore(playerId, round));
    const rejoins = this.playerNames.map((_, playerId) => this.getNumberOfRejoins(playerId, round));
    return this.playerNames.map((pn) => this.getPlayerId(pn)).sort((p1, p2) => totalScores[p1] - totalScores[p2] || rejoins[p1] - rejoins[p2]);
  }

  //#endregion ranking

  //#region ranking:playerDisplay

  public getPlayerPosition(playerId: number, round = this.getNextRoundNumber() - 1): number {
    const totalScores = this.playerNames.map((_, playerId) => this.getTotalScore(playerId, round));
    const totalScoresSorted = [...totalScores].sort((n1, n2) => n1 - n2);
    return totalScoresSorted.indexOf(totalScores[playerId]) + 1;
  }

  public getPlayerName(playerId: number): string {
    return this.playerNames[playerId];
  }

  /**
   * round 0 -> 0
   * round 1 -> scores[playerId][0] || rejoinScore
   * round 2 -> (scores[playerId][0] || rejoinScore) + scores[playerId][1] || rejoinScore
   * ...
   *
   * By default returns the score after last played round
   */
  public getTotalScore(playerId: number, round: number = this.scores[playerId].length): number {
    const numberOfPlayers = this.playerNames.length;

    let accumulatedScoresAtRound = new Array(numberOfPlayers).fill(0);
    for (let r = 0; r < round; r++) {
      accumulatedScoresAtRound = accumulatedScoresAtRound.map((scoreAcc, i) => scoreAcc + this.scores[i][r]);
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
    const lastRoundIndex = this.scores[playerId].length - 1;
    return this.scores[playerId][lastRoundIndex];
  }

  // enterScoreRoute: RoutingPath -> property already declared by bottomControls:newRound

  //#endregion ranking:playerDisplay

  //#region ranking:playerDisplay:numberOfRejoins

  public getNumberOfRejoins(playerId: number, round = this.getNextRoundNumber() - 1): number {
    const numberOfRejoins = new Array(this.playerNames.length).fill(0);
    const numberOfPlayers = this.playerNames.length;

    let accumulatedScoresAtRound = new Array(numberOfPlayers).fill(0);
    for (let r = 0; r < round; r++) {
      accumulatedScoresAtRound = accumulatedScoresAtRound.map((scoreAcc, i) => scoreAcc + this.scores[i][r]);
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

  //#endregion ranking:playerDisplay:numberOfRejoins

  //#region scoreboard

  // enterScoreRoute: RoutingPath -> property already declared by bottomControls:newRound

  public playerNames: string[] = [];

  public getPlayerScore(playerId: number, round: number = this.scores[playerId].length - 1) {
    return this.scores[playerId][round];
  }

  /**
   * round 0 -> 0
   * round 1 -> score[playerId][0]
   * round 2 -> (score[playerId][0] || rejoinScore) + score[playerId][1]
   *
   * The difference with getTotalScore is that for the requested round, it does not reset the score to rejoinScore
   */
  public getPlayerAccumulatedScoreAtRound(playerId: number, round: number): number {
    const numberOfPlayers = this.playerNames.length;

    let accumulatedScoresAtRound = new Array(numberOfPlayers).fill(0);
    for (let r = 0; r < round; r++) {
      accumulatedScoresAtRound = accumulatedScoresAtRound.map((scoreAcc, playerId) => scoreAcc + this.getPlayerScore(playerId, r));
      const rejoinScore = Math.max(...accumulatedScoresAtRound.filter((s) => s <= this.limitScore));
      const thereIsWinner = accumulatedScoresAtRound.filter((s) => s <= this.limitScore).length <= 1;

      // reset scores outside limit
      if (!thereIsWinner) {
        for (let p = 0; p < numberOfPlayers; p++) {
          // in this condition is the difference with getTotalScore
          if (accumulatedScoresAtRound[p] > this.limitScore && r !== round - 1) {
            accumulatedScoresAtRound[p] = rejoinScore;
          }
        }
      }
    }

    return accumulatedScoresAtRound[playerId];
  }

  //  getTotalScore: (playerId: number, round?: number) => number -> property already declared by ranking:playerDisplay

  public getCellBackgroundColor(score: number): string {
    return `background-color: ${score > 0 ? '#f8c8c8' : '#b3ffb3'}`;
  }

  //#endregion scoreboard

  //#region scoreboard:specialRounds

  public showSpecialRowAfterRound(round: number): boolean {
    if (round === this.getNextRoundNumber() - 2 && this.gameHasFinished()) {
      return false;
    }
    return this.getSpecialRoundScores(round).some((score) => score != 0);
  }

  public getSpecialRoundScores(round: number): number[] {
    const numberOfPlayers = this.playerNames.length;

    let accumulatedScoresAtRound = new Array(numberOfPlayers).fill(0);
    let accumulatedScoresAtSpecialRound = new Array(numberOfPlayers).fill(0);
    for (let r = 0; r < round + 1; r++) {
      accumulatedScoresAtRound = accumulatedScoresAtRound.map((scoreAcc, i) => scoreAcc + this.scores[i][r]);
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

    const numberOfPlayers = this.playerNames.length;
    let rejoinScore: number = 0;

    let accumulatedScoresAtRound = new Array(numberOfPlayers).fill(0);
    for (let r = 0; r < round + 1; r++) {
      accumulatedScoresAtRound = accumulatedScoresAtRound.map((scoreAcc, i) => scoreAcc + this.scores[i][r]);
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

  //#endregion scoreboard:specialRounds

  //#region statistics

  public getPlayersInFirstPosition(): string {
    const positions = this.playerNames.map((_, playerId) => this.getPlayerPosition(playerId));
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
    const positions = this.playerNames.map((_, playerId) => this.getPlayerPosition(playerId));
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
    const players = this.playerNames.filter((_, playerId) => this.scores[playerId].includes(maxScore));
    return this.formatter.format(players);
  }

  public getMinimumScoreInOneRound(): number {
    return Math.min(...this.scores.flatMap((scores) => scores));
  }

  public getPlayerNamesWithMinimumScoreInOneRound(): string {
    const minScore = this.getMinimumScoreInOneRound();
    const players = this.playerNames.filter((_, playerId) => this.scores[playerId].includes(minScore));
    return this.formatter.format(players);
  }

  //#endregion statistics

  //#region statistics:progressGraph

  public readonly svgWidth = 300;

  public readonly svgHeight = 200;

  public getSvgPlayerLine(playerId: number): string {
    let path = `M 0,${this.svgXAxisHeight}`;

    const minimumScore = Math.min(...this.playerNames.map((_, playerId) => this.getMinimumReachedScore(playerId)));
    const maximumScore = Math.max(
      ...this.playerNames.map((_, playerId) => this.getMaximumReachedScore(playerId)),
      this.limitScore + this.svgLimitScoreMargin
    );
    const svgRoundWidth = this.svgWidth / (this.getNextRoundNumber() - 1);

    const numberOfPlayers = this.playerNames.length;
    const numberOfRounds = this.getNextRoundNumber() - 1;

    let accumulatedScoresAtRound = new Array(numberOfPlayers).fill(0);
    for (let r = 0; r < numberOfRounds; r++) {
      accumulatedScoresAtRound = accumulatedScoresAtRound.map((scoreAcc, i) => scoreAcc + this.scores[i][r]);
      const rejoinScore = Math.max(...accumulatedScoresAtRound.filter((s) => s <= this.limitScore));
      const thereIsWinner = accumulatedScoresAtRound.filter((s) => s <= this.limitScore).length <= 1;

      const pointX = svgRoundWidth * (r + 1);
      const pointY = this.svgHeight * ((accumulatedScoresAtRound[playerId] - minimumScore) / (maximumScore - minimumScore));
      path += ` ${pointX},${pointY}`;

      // reset scores outside limit
      if (!thereIsWinner) {
        for (let p = 0; p < numberOfPlayers; p++) {
          if (accumulatedScoresAtRound[p] > this.limitScore) {
            accumulatedScoresAtRound[p] = rejoinScore;
            const pointX = svgRoundWidth * (r + 1);
            const pointY = this.svgHeight * ((accumulatedScoresAtRound[playerId] - minimumScore) / (maximumScore - minimumScore));
            path += ` ${pointX},${pointY}`;
          }
        }
      }
    }

    return path;
  }

  public get svgXAxisHeight(): number {
    const minimumScore = Math.min(...this.playerNames.map((_, playerId) => this.getMinimumReachedScore(playerId)));
    const maximumScore = Math.max(
      ...this.playerNames.map((_, playerId) => this.getMaximumReachedScore(playerId)),
      this.limitScore + this.svgLimitScoreMargin
    );

    return this.svgHeight * (-minimumScore / (maximumScore - minimumScore)) || 0.5;
  }

  // playerNames: string[] -> property already declared by scoreboard

  // getNextRoundNumber: () => number -> property already declared by game:rounds

  // getRankingPlayers(round: number): number[] -> property already declared by ranking

  // getPlayerName: (playerId: number) => string -> property already declared by ranking:playerDisplay

  // getTotalScore: (playerId: number, round: number) => number -> property already declared by ranking:playerDisplay

  // getPlayerPosition(playerId: number, round: number): number -> property already declared by ranking:playerDisplay

  //#endregion statistics:progressGraph

  //#region statistics:progressGraph:limitScore

  get svgLimitScoreHeight(): number {
    const minimumScore = Math.min(...this.playerNames.map((_, playerId) => this.getMinimumReachedScore(playerId)));
    const maximumScore = Math.max(
      ...this.playerNames.map((_, playerId) => this.getMaximumReachedScore(playerId)),
      this.limitScore + this.svgLimitScoreMargin
    );

    return this.svgHeight * ((this.limitScore - minimumScore) / (maximumScore - minimumScore));
  }

  //#endregion statistics:progressGraph:limitScore

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

  //#region helpers

  private getMaximumReachedScore(playerId: number): number {
    const numberOfPlayers = this.playerNames.length;
    const numberOfRounds = this.getNextRoundNumber() - 1;
    let maximumScore = 0;

    let accumulatedScoresAtRound = new Array(numberOfPlayers).fill(0);
    for (let round = 0; round < numberOfRounds; round++) {
      accumulatedScoresAtRound = accumulatedScoresAtRound.map((scoreAcc, playerId) => scoreAcc + this.scores[playerId][round]);
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
    const numberOfPlayers = this.playerNames.length;
    const numberOfRounds = this.getNextRoundNumber() - 1;
    let minimum = 0;

    let accumulatedScoresAtRound = new Array(numberOfPlayers).fill(0);
    for (let round = 0; round < numberOfRounds; round++) {
      accumulatedScoresAtRound = accumulatedScoresAtRound.map((scoreAcc, playerId) => scoreAcc + this.scores[playerId][round]);
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

  //#endregion helpers
}
