import { Injectable } from '@angular/core';
import { FormArray, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { EnterPlayerNamesModel } from '../components/enter-player-names/enter-player-names.component';
import { LOCAL_STORE_KEYS } from '../constants/local-storage-keys';
import { RoutingPath } from '../constants/routes';
import { Player } from '../interfaces/player';
import { Flag, FlagMapping } from './flags';
import { GameServiceWithFlags } from './game.service';

const briscaFlags = ['gameConfig:modality'] as const;

type BriscaFlags = (typeof briscaFlags)[number];

@Injectable()
export class BriscaService implements GameServiceWithFlags<BriscaFlags> {
  private readonly modalityIndividualTeamControl = this.fb.control({ teamName: 'Jugadores', playerNames: ['', ''], dealingPlayerIndex: 0 });
  private readonly modalityTeamsTeam1Control = this.fb.control({ teamName: 'Ellos', playerNames: ['', '', ''], dealingPlayerIndex: 0 });
  private readonly modalityTeamsTeam2Control = this.fb.control({ teamName: 'Nosotros', playerNames: ['', '', ''], dealingPlayerIndex: -1 });
  private numberOfPlayersInTeamsModality = 3;

  public constructor(private readonly fb: NonNullableFormBuilder) {
    this.modalityFormControl = this.fb.control(this.modality);
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
    this.teamControls = this.fb.array([this.modalityTeamsTeam1Control, this.modalityTeamsTeam2Control]);

    this.modalityTeamsTeam1Control.valueChanges.pipe().subscribe((value) => this.onChangeTeamControl(value, this.modalityTeamsTeam2Control));
    this.modalityTeamsTeam2Control.valueChanges.pipe().subscribe((value) => this.onChangeTeamControl(value, this.modalityTeamsTeam1Control));
  }

  private onChangeTeamControl(value: EnterPlayerNamesModel, editControl: FormControl<EnterPlayerNamesModel>) {
    if (value.playerNames.length !== this.numberOfPlayersInTeamsModality) {
      this.numberOfPlayersInTeamsModality = value.playerNames.length;
      const v = editControl.value;
      v.playerNames.length = this.numberOfPlayersInTeamsModality;
      editControl.setValue(v);
    }

    if (value.dealingPlayerIndex !== -1) {
      const v = editControl.value;
      v.dealingPlayerIndex = -1;
      editControl.setValue(v);
    }
  }

  public readonly flags: Flag[] = briscaFlags as any as BriscaFlags[];
  public hasFlagActive<K extends keyof FlagMapping>(flag: K): this is GameServiceWithFlags<K> {
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
        teams:
          this.modality === 'individual'
            ? this.modalityIndividualTeamControl.value
            : [this.modalityTeamsTeam1Control.value, this.modalityTeamsTeam2Control.value],
      })
    );
  }

  public loadStateFromLocalStorage(): void {
    const settings = JSON.parse(localStorage.getItem(LOCAL_STORE_KEYS.SETTINGS(this.gameName))!);
    this.modality = settings.modality;
    this.modalityFormControl.setValue(this.modality);

    this.teamControls.clear();
    if (this.modality === 'individual') {
      this.modalityIndividualTeamControl.setValue(settings.teams);
      this.teamControls.push(this.modalityIndividualTeamControl);
    } else if (this.modality === 'teams') {
      this.modalityTeamsTeam1Control.setValue(settings.teams[0]);
      this.modalityTeamsTeam2Control.setValue(settings.teams[1]);

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
    let playerNames: string[] = [];

    if (this.modality === 'individual') {
      playerNames = this.modalityIndividualTeamControl.value.playerNames;
    } else if (this.modality === 'teams') {
      const playerNamesTeam1 = this.modalityTeamsTeam1Control.value.playerNames;
      const playerNamesTeam2 = this.modalityTeamsTeam2Control.value.playerNames;
      playerNames = playerNamesTeam1.map((_: string, i: number) => [playerNamesTeam1[i], playerNamesTeam2[i]]).flatMap((e) => e);
    }

    this.players = playerNames.map((name, id) => ({ name, id, scores: [], punctuation: 0 }));
  }

  public onEditConfigCurrentGame(): void {
    throw new Error('Method not implemented.');
  }
  public readonly startGameRoute: RoutingPath;
  public readonly enterScoreRoute: RoutingPath;
  public gameHasStarted(): boolean {
    throw new Error('Method not implemented.');
  }
  public gameHasFinished(): boolean {
    throw new Error('Method not implemented.');
  }
  public getNextRoundNumber(): number {
    throw new Error('Method not implemented.');
  }
  public getPlayerNameThatDeals(): string {
    throw new Error('Method not implemented.');
  }

  private _players: Player[] = [];

  public get players(): Player[] {
    return [...this._players];
  }

  public set players(value: Player[]) {
    this._players = value;
  }

  public readonly dealingPlayerIndex: number;
  public setNextDealingPlayer(): void {
    throw new Error('Method not implemented.');
  }

  // * flag -> gameConfig:modality
  public modality: 'individual' | 'teams' = 'teams';
  public modalityFormControl: FormControl<'individual' | 'teams'>; // init in the constructor
}
