import { Injectable } from '@angular/core';
import { FormArray, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { EnterPlayerNamesModel } from '../components/enter-player-names/enter-player-names.component';
import { LOCAL_STORE_KEYS } from '../constants/local-storage-keys';
import { ROUTING_PATHS, RoutingPath } from '../constants/routes';
import { Flag, FlagMapping } from './flags';
import { GameServiceWithFlags } from './game.service';

const briscaFlags = [
  'game:gameStartEnd',
  'game:localStorageSave',
  'game:rounds',
  'resumeGame:gameName',
  'gameConfig',
  'gameConfig:validation',
  'gameConfig:players',
  'gameConfig:limitScore',
  'gameConfig:modality',
  'roundInfo:gameName',
  'roundInfo:dealingPlayer',
  'roundInfo:limitScore',
  'bottomControls:newRound',
  'brisca',
  'enterScore:brisca',
] as const;

type BriscaFlags = (typeof briscaFlags)[number];

@Injectable()
export class BriscaService implements GameServiceWithFlags<BriscaFlags> {
  private readonly modalityIndividualTeamControl = this.fb.control({ teamName: 'Jugadores', playerNames: ['', ''], dealingPlayerIndex: 0 });
  private readonly modalityTeamsTeam1Control = this.fb.control({ teamName: 'Nosotros', playerNames: ['', '', ''], dealingPlayerIndex: 0 });
  private readonly modalityTeamsTeam2Control = this.fb.control({ teamName: 'Ellos', playerNames: ['', '', ''], dealingPlayerIndex: -1 });
  private dealingPlayerIndex: number = 0;

  public constructor(private readonly fb: NonNullableFormBuilder, private readonly router: Router) {
    this.modalityFormControl = this.fb.control(this.modality);
    this.teamControls = this.fb.array([this.modalityTeamsTeam1Control, this.modalityTeamsTeam2Control]);

    this.modalityFormControl.valueChanges.subscribe((v) => {
      if (v === 'individual') {
        this.teamControls.clear();
        this.usePlayerNames(this.getPlayerNames('teams'), v)
        this.teamControls.push(this.modalityIndividualTeamControl);
        this.allowEditTeamName = [false];
      } else if (v === 'teams') {
        this.usePlayerNames(this.getPlayerNames('individual'), v)
        this.teamControls.clear();
        this.teamControls.push(this.modalityTeamsTeam1Control);
        this.teamControls.push(this.modalityTeamsTeam2Control);
        this.allowEditTeamName = [true, true];
      }
    });
    this.modalityTeamsTeam1Control.valueChanges.pipe().subscribe((value) => this.onChangeTeamControl(value, this.modalityTeamsTeam2Control));
    this.modalityTeamsTeam2Control.valueChanges.pipe().subscribe((value) => this.onChangeTeamControl(value, this.modalityTeamsTeam1Control));
  }

  private numberOfPlayersInTeamsModality = 3;
  private onChangeTeamControl(value: EnterPlayerNamesModel, editControl: FormControl<EnterPlayerNamesModel>) {
    // changes the number of players
    if (value.playerNames.length !== this.numberOfPlayersInTeamsModality) {
      this.numberOfPlayersInTeamsModality = value.playerNames.length;
      const tempValue = editControl.value;
      tempValue.playerNames.length = this.numberOfPlayersInTeamsModality;

      // if delete a player, check it is not last dealing player index in other team
      if (value.dealingPlayerIndex < 0 && tempValue.dealingPlayerIndex === this.numberOfPlayersInTeamsModality) {
        tempValue.dealingPlayerIndex--;
      }

      editControl.setValue(tempValue);
    }

    // changed the dealing player
    if (value.dealingPlayerIndex !== -1) {
      const tempValue = editControl.value;
      tempValue.dealingPlayerIndex = -1;
      editControl.setValue(tempValue);
    }
  }

  //#region GameService

  public readonly gameName = 'Brisca';

  public readonly startGameRoute: RoutingPath = ROUTING_PATHS.BRISCA;

  public readonly flags: Flag[] = briscaFlags as any as BriscaFlags[];

  public hasFlagActive<K extends keyof FlagMapping>(flag: K): this is GameServiceWithFlags<K> {
    // do not allow to change the modality once the game has started (edition mode)
    if (this.router.url === `/${ROUTING_PATHS.CHANGE_CONFIG}` && flag === 'gameConfig:modality') return false;

    return this.flags.includes(flag);
  }

  public isGameServiceWithFlags<K extends Flag[]>(flags: K): this is GameServiceWithFlags<K[number]> {
    return flags.every((f) => this.hasFlagActive(f));
  }

  //#endregion GameService

  //#region game:gameStartEnd

  public gameHasStarted(): boolean {
    return this.scores.reduce((prev, curr) => prev + curr, 0) > 0;
  }

  public gameHasFinished(): boolean {
    return this.scores.some(score => score >= this.limitScore);
  }

  //#endregion game:gameStartEnd

  //#region game:localStorageSave

  public saveStateToLocalStorage(): void {
    localStorage.setItem(
      LOCAL_STORE_KEYS.SETTINGS(this.gameName),
      JSON.stringify({
        modality: this.modality,
        scores: this.scores,
        teamNames: this.teamNames,
        playerNames: this.playerNames,
        dealingPlayerIndex: this.dealingPlayerIndex,
      })
    );
  }

  public loadStateFromLocalStorage(): void {
    const settings = JSON.parse(localStorage.getItem(LOCAL_STORE_KEYS.SETTINGS(this.gameName))!);
    this.modality = settings.modality;
    this.modalityFormControl.setValue(this.modality);

    this.scores = settings.scores;

    this.teamNames = settings.teamNames;
    this.playerNames = settings.playerNames;
    this.dealingPlayerIndex = settings.dealingPlayerIndex;

    this.teamControls.clear();
    if (this.modality === 'individual') {
      this.modalityIndividualTeamControl.setValue({
        teamName: 'Jugadores',
        playerNames: [...this.playerNames],
        dealingPlayerIndex: this.dealingPlayerIndex,
      });
      this.teamControls.push(this.modalityIndividualTeamControl);
    } else if (this.modality === 'teams') {
      this.modalityTeamsTeam1Control.setValue({
        dealingPlayerIndex: this.dealingPlayerIndex % 2 === 0 ? Math.trunc(this.dealingPlayerIndex / 2) : -1,
        playerNames: this.playerNames.filter((_, i) => i % 2 === 0),
        teamName: this.teamNames[0],
      });
      this.modalityTeamsTeam2Control.setValue({
        dealingPlayerIndex: this.dealingPlayerIndex % 2 !== 0 ? Math.trunc(this.dealingPlayerIndex / 2) : -1,
        playerNames: this.playerNames.filter((_, i) => i % 2 !== 0),
        teamName: this.teamNames[1],
      });

      this.teamControls.push(this.modalityTeamsTeam1Control);
      this.teamControls.push(this.modalityTeamsTeam2Control);
    }
  }

  //#endregion game:localStorageSave

  //#region game:rounds

  public getNextRoundNumber(): number {
    return this.scores.reduce((prev, curr) => prev + curr, 1);
  }

  //#endregion game:rounds

  //#region resumeGame:gameName

  // gameName: string -> property already declared by GameService

  //#endregion resumeGame:gameName

  //#region gameConfig

  public onStartGame(): void {
    this.modality = this.modalityFormControl.value;
    this.limitScore = this.limitScoreFormControl.value;

    if (this.modality === 'individual') {
      this.playerNames = this.modalityIndividualTeamControl.value.playerNames.map((n) => n.trim());
      this.dealingPlayerIndex = this.modalityIndividualTeamControl.value.dealingPlayerIndex;
      this.scores = this.playerNames.map(() => 0);
    } else if (this.modality === 'teams') {
      const playerNamesTeam1 = this.modalityTeamsTeam1Control.value.playerNames.map((n) => n.trim());
      const playerNamesTeam2 = this.modalityTeamsTeam2Control.value.playerNames.map((n) => n.trim());
      this.playerNames = playerNamesTeam1.map((_: string, i: number) => [playerNamesTeam1[i], playerNamesTeam2[i]]).flatMap((e) => e);
      this.teamNames = [this.modalityTeamsTeam1Control.value.teamName.trim(), this.modalityTeamsTeam2Control.value.teamName.trim()];
      this.dealingPlayerIndex =
        this.modalityTeamsTeam1Control.value.dealingPlayerIndex !== -1
          ? this.modalityTeamsTeam1Control.value.dealingPlayerIndex * 2
          : this.modalityTeamsTeam2Control.value.dealingPlayerIndex * 2 + 1;
      this.scores = [0, 0];
    }

    // show always the delete banner after starting a new game by deleting the local storage key
    localStorage.removeItem(LOCAL_STORE_KEYS.BRISCA_LAST_TIME_DELETE_BANNER);
  }

  public onEditConfigCurrentGame(): void {
    this.limitScore = this.limitScoreFormControl.value;

    if (this.modality === 'individual') {
      this.dealingPlayerIndex = this.modalityIndividualTeamControl.value.dealingPlayerIndex;

      const newPlayersAndScores = this.modalityIndividualTeamControl.value.playerNames
        .map((n) => n.trim())
        .map((newName) => {
          const existingPlayer = this.playerNames.includes(newName);

          if (existingPlayer) {
            return { name: newName, score: this.scores[this.playerNames.indexOf(newName)] };
          }

          return { name: newName, score: 0 };
        });

      this.playerNames = newPlayersAndScores.map((e) => e.name);
      this.scores = newPlayersAndScores.map((e) => e.score);
      return;
    }

    // modality -> teams
    const playerNamesTeam1 = this.modalityTeamsTeam1Control.value.playerNames.map((n) => n.trim());
    const playerNamesTeam2 = this.modalityTeamsTeam2Control.value.playerNames.map((n) => n.trim());
    this.playerNames = playerNamesTeam1.map((_: string, i: number) => [playerNamesTeam1[i], playerNamesTeam2[i]]).flatMap((e) => e);
    this.teamNames = [this.modalityTeamsTeam1Control.value.teamName.trim(), this.modalityTeamsTeam2Control.value.teamName.trim()];
    this.dealingPlayerIndex =
      this.modalityTeamsTeam1Control.value.dealingPlayerIndex !== -1
        ? this.modalityTeamsTeam1Control.value.dealingPlayerIndex * 2
        : this.modalityTeamsTeam2Control.value.dealingPlayerIndex * 2 + 1;
  }

  //#endregion gameConfig

  //#region gameConfig:validation

  public isGameConfigCorrect(): boolean {
    return this.teamControls.controls.every(
      (control) => control.value.playerNames.every((p) => p.trim() !== '') && control.value.teamName.trim() !== ''
    );
  }

  //#endregion gameConfig:validation

  //#region gameConfig:players

  public allowEditTeamName = [true, true];

  // init in the constructor
  public teamControls: FormArray<FormControl<EnterPlayerNamesModel>>;

  public usePlayerNames(playerNames: string[], modality = this.modalityFormControl.value): void {
    if (modality === 'individual') {
      const tempValue = this.modalityIndividualTeamControl.value;
      tempValue.playerNames = [...playerNames];
      this.modalityIndividualTeamControl.setValue(tempValue);
    } else if (modality === 'teams') {
      const tempValue1 = this.modalityTeamsTeam1Control.value;
      tempValue1.playerNames = playerNames.filter((_, i) => i % 2 === 0);
      this.modalityTeamsTeam1Control.setValue(tempValue1);

      const tempValue2 = this.modalityTeamsTeam2Control.value;
      tempValue2.playerNames = playerNames.filter((_, i) => i % 2 !== 0);
      this.modalityTeamsTeam2Control.setValue(tempValue2);
    }
  }

  public getPlayerNames(modality = this.modalityFormControl.value): string[] {
    if (modality === 'individual') {
      return this.modalityIndividualTeamControl.value.playerNames;
    } else if (modality === 'teams') {
      return this.modalityTeamsTeam1Control.value.playerNames.flatMap((_, i) => ([
        this.modalityTeamsTeam1Control.value.playerNames[i],
        this.modalityTeamsTeam2Control.value.playerNames[i],
      ]));
    } else {
      return []; // not possible
    }
  }

  //#endregion gameConfig:players

  //#region gameConfig:limitScore

  public limitScore: number = 9;

  public limitScoreFormControl = this.fb.control(this.limitScore);

  public numberOfScrollers: number = 2;

  //#endregion

  //#region gameConfig:modality

  public modality: 'individual' | 'teams' = 'teams';

  // init in the constructor
  public modalityFormControl: FormControl<'individual' | 'teams'>;

  //#endregion gameConfig:modality

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

  //#region bottomControls:newRound

  public readonly enterScoreRoute: RoutingPath = ROUTING_PATHS.ENTER_SCORE_BRISCA;

  //#endregion bottomControls:newRound

  //#region brisca

  // modality: 'individual' | 'teams' -> property already declared by gameConfig:modality

  public playerNames: string[] = [];

  public teamNames: string[] = [];

  public scores: number[] = [0, 0];

  public setPreviousDealingPlayerIndex(): void {
    this.dealingPlayerIndex--;
    if (this.dealingPlayerIndex < 0) {
      this.dealingPlayerIndex = this.playerNames.length - 1;
    }
    if (this.modality === 'individual') {
      const tempValue = this.modalityIndividualTeamControl.value;
      tempValue.dealingPlayerIndex = this.dealingPlayerIndex;
      this.modalityIndividualTeamControl.setValue(tempValue);
    } else if (this.modality === 'teams') {
      const tempValue1 = this.modalityTeamsTeam1Control.value;
      tempValue1.dealingPlayerIndex = this.dealingPlayerIndex % 2 === 0 ? Math.floor(this.dealingPlayerIndex / 2) : -1;
      this.modalityTeamsTeam1Control.setValue(tempValue1);

      const tempValue2 = this.modalityTeamsTeam2Control.value;
      tempValue2.dealingPlayerIndex = this.dealingPlayerIndex % 2 !== 0 ? Math.floor(this.dealingPlayerIndex / 2) : -1;
      this.modalityTeamsTeam2Control.setValue(tempValue2);
    }
  }

  //#endregion brisca

  //#region enterScore:brisca

  // modality: 'individual' | 'teams' -> property already declared by gameConfig:modality

  // playerNames: string[] -> property already declared by brisca

  // teamNames: string[] -> property already declared by brisca

  // scores: number[] -> property already declared by brisca

  public setNextDealingPlayer(): void {
    this.dealingPlayerIndex++;
    if (this.dealingPlayerIndex >= this.playerNames.length) {
      this.dealingPlayerIndex = 0;
    }
    if (this.modality === 'individual') {
      const tempValue = this.modalityIndividualTeamControl.value;
      tempValue.dealingPlayerIndex = this.dealingPlayerIndex;
      this.modalityIndividualTeamControl.setValue(tempValue);
    } else if (this.modality === 'teams') {
      const tempValue1 = this.modalityTeamsTeam1Control.value;
      tempValue1.dealingPlayerIndex = this.dealingPlayerIndex % 2 === 0 ? Math.floor(this.dealingPlayerIndex / 2) : -1;
      this.modalityTeamsTeam1Control.setValue(tempValue1);

      const tempValue2 = this.modalityTeamsTeam2Control.value;
      tempValue2.dealingPlayerIndex = this.dealingPlayerIndex % 2 !== 0 ? Math.floor(this.dealingPlayerIndex / 2) : -1;
      this.modalityTeamsTeam2Control.setValue(tempValue2);
    }
  }

  //#endregion enterScore:brisca
}
