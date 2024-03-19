import { Injectable } from '@angular/core';
import { FormArray, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { EnterPlayerNamesModel } from '../components/enter-player-names/enter-player-names.component';
import { LOCAL_STORE_KEYS } from '../constants/local-storage-keys';
import { ROUTING_PATHS, RoutingPath } from '../constants/routes';
import { Player } from '../interfaces/player';
import { Flag, FlagMapping } from './flags';
import { GameServiceWithFlags } from './game.service';

const briscaFlags = ['resumeGame:gameName', 'gameConfig:modality', 'roundInfo:gameName'] as const;

type BriscaFlags = (typeof briscaFlags)[number];

@Injectable()
export class BriscaService implements GameServiceWithFlags<BriscaFlags> {
  private readonly modalityIndividualTeamControl = this.fb.control({ teamName: 'Jugadores', playerNames: ['', ''], dealingPlayerIndex: 0 });
  private readonly modalityTeamsTeam1Control = this.fb.control({ teamName: 'Nosotros', playerNames: ['', '', ''], dealingPlayerIndex: 0 });
  private readonly modalityTeamsTeam2Control = this.fb.control({ teamName: 'Ellos', playerNames: ['', '', ''], dealingPlayerIndex: -1 });

  public playerNames: string[] = [];
  public scores: number[] = [0, 0];
  public teamNames: string[] = [];

  public constructor(private readonly fb: NonNullableFormBuilder, private readonly router: Router) {
    this.modalityFormControl = this.fb.control(this.modality);
    this.teamControls = this.fb.array([this.modalityTeamsTeam1Control, this.modalityTeamsTeam2Control]);

    this.modalityFormControl.valueChanges.subscribe((v) => {
      if (v === 'individual') {
        this.teamControls.clear();
        this.teamControls.push(this.modalityIndividualTeamControl);
        this.allowEditTeamName = [false];
      } else if (v === 'teams') {
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

  public readonly flags: Flag[] = briscaFlags as any as BriscaFlags[];
  public hasFlagActive<K extends keyof FlagMapping>(flag: K): this is GameServiceWithFlags<K> {
    // do not allow to change the modality once the game has started (edition mode)
    if (this.router.url === `/${ROUTING_PATHS.CHANGE_CONFIG}` && flag === 'gameConfig:modality') return false;

    return this.flags.includes(flag);
  }

  public readonly gameName = 'Brisca';

  public allowEditTeamName = [true, true];

  public teamControls: FormArray<FormControl<EnterPlayerNamesModel>>; // init in the constructor

  public saveStateToLocalStorage(): void {
    localStorage.setItem(
      LOCAL_STORE_KEYS.SETTINGS(this.gameName),
      JSON.stringify({
        modality: this.modality,
        playerNames: this.playerNames,
        scores: this.scores,
        dealingPlayerIndex: this.dealingPlayerIndex,
        teamNames: this.teamNames,
      })
    );
  }

  public loadStateFromLocalStorage(): void {
    const settings = JSON.parse(localStorage.getItem(LOCAL_STORE_KEYS.SETTINGS(this.gameName))!);
    this.modality = settings.modality;
    this.modalityFormControl.setValue(this.modality);

    this.playerNames = settings.playerNames;
    this.scores = settings.scores;
    this.dealingPlayerIndex = settings.dealingPlayerIndex;
    this.teamNames = settings.teamNames;

    this.teamControls.clear();
    if (this.modality === 'individual') {
      this.modalityIndividualTeamControl.setValue({
        teamName: 'Jugadores',
        playerNames: this.playerNames,
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

  public isGameConfigCorrect(): boolean {
    return this.teamControls.controls.every(
      (control) => control.value.playerNames.every((p) => p.trim() !== '') && control.value.teamName.trim() !== ''
    );
  }

  public onStartGame(): void {
    this.modality = this.modalityFormControl.value;

    if (this.modality === 'individual') {
      this.playerNames = this.modalityIndividualTeamControl.value.playerNames;
      this.scores = this.playerNames.map(() => 0);
      this.dealingPlayerIndex = this.modalityIndividualTeamControl.value.dealingPlayerIndex;
    } else if (this.modality === 'teams') {
      const playerNamesTeam1 = this.modalityTeamsTeam1Control.value.playerNames;
      const playerNamesTeam2 = this.modalityTeamsTeam2Control.value.playerNames;
      this.playerNames = playerNamesTeam1.map((_: string, i: number) => [playerNamesTeam1[i], playerNamesTeam2[i]]).flatMap((e) => e);
      this.scores = [0, 0];
      this.teamNames = [this.modalityTeamsTeam1Control.value.teamName, this.modalityTeamsTeam2Control.value.teamName];
      this.dealingPlayerIndex =
        this.modalityTeamsTeam1Control.value.dealingPlayerIndex !== -1
          ? this.modalityTeamsTeam1Control.value.dealingPlayerIndex * 2
          : this.modalityTeamsTeam2Control.value.dealingPlayerIndex * 2 + 1;
    }

    // show always the delete banner after starting a new game
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    localStorage.setItem(LOCAL_STORE_KEYS.BRISCA_LAST_TIME_DELETE_BANNER, JSON.stringify(Date.now() - oneDayAgo));
  }

  public onEditConfigCurrentGame(): void {
    if (this.modality === 'individual') {
      this.dealingPlayerIndex = this.modalityIndividualTeamControl.value.dealingPlayerIndex;
      this.playerNames = this.modalityIndividualTeamControl.value.playerNames;
      this.scores.length = this.playerNames.length;
      for (let i = 0; i < this.scores.length; i++) {
        if (!this.scores[i]) this.scores[i] = 0;
      }
      return;
    }

    // modality -> teams
    const playerNamesTeam1 = this.modalityTeamsTeam1Control.value.playerNames;
    const playerNamesTeam2 = this.modalityTeamsTeam2Control.value.playerNames;
    this.playerNames = playerNamesTeam1.map((_: string, i: number) => [playerNamesTeam1[i], playerNamesTeam2[i]]).flatMap((e) => e);
    this.teamNames = [this.modalityTeamsTeam1Control.value.teamName, this.modalityTeamsTeam2Control.value.teamName];
    this.dealingPlayerIndex =
      this.modalityTeamsTeam1Control.value.dealingPlayerIndex !== -1
        ? this.modalityTeamsTeam1Control.value.dealingPlayerIndex * 2
        : this.modalityTeamsTeam2Control.value.dealingPlayerIndex * 2 + 1;
  }

  public readonly startGameRoute: RoutingPath = ROUTING_PATHS.BRISCA;

  public readonly enterScoreRoute: RoutingPath = ROUTING_PATHS.ENTER_SCORE_BRISCA;

  // TODO check if started and finsied interface is ncessary and remove the dependency creating a new flag
  public gameHasStarted(): boolean {
    throw new Error('Method not implemented.');
  }
  public gameHasFinished(): boolean {
    return false;
  }

  public getNextRoundNumber(): number {
    return this.scores.reduce((prev, curr) => prev + curr, 1);
  }

  public getPlayerNameThatDeals(): string {
    return this.playerNames[this.dealingPlayerIndex];
  }

  // TODO check if players interface is used or the dependency with bottom control can be removed
  private _players: Player[] = [];

  public get players(): Player[] {
    return [...this._players];
  }

  public set players(value: Player[]) {
    this._players = value;
  }

  public dealingPlayerIndex: number = 0;
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
  // this method is not part of any interface
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

  // * flag -> gameConfig:modality
  public modality: 'individual' | 'teams' = 'teams';
  public modalityFormControl: FormControl<'individual' | 'teams'>; // init in the constructor
}
