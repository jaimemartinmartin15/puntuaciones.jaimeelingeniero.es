import { FormArray, FormControl } from '@angular/forms';
import { EnterPlayerNamesModel } from '../components/enter-player-names/enter-player-names.component';
import { RoutingPath } from '../constants/routes';
import { Player } from '../interfaces/player';
import { Flag, FlagMapping } from './flags';

export type GameServiceWithFlags<K extends Flag> = GameService & { [P in K]: (x: FlagMapping[P]) => void } extends { [P in K]: (x: infer I) => void }
  ? I
  : never;

export interface GameService {
  readonly flags: Flag[];
  hasFlagActive<K extends Flag>(flag: K): this is GameServiceWithFlags<K>;

  readonly gameName: string;

  readonly allowEditTeamName: boolean[];
  teamControls: FormArray<FormControl<EnterPlayerNamesModel>>;

  saveStateToLocalStorage(): void;
  loadStateFromLocalStorage(): void;

  isGameConfigCorrect(): boolean;
  onStartGame(): void;
  onEditConfigCurrentGame(): void;

  readonly startGameRoute: RoutingPath;
  readonly enterScoreRoute: RoutingPath;

  gameHasStarted(): boolean;
  gameHasFinished(): boolean;

  getNextRoundNumber(): number; // TODO move to a flag?
  getPlayerNameThatDeals(): string; // TODO move to a flag?

  get players(): Player[]; // TODO move to a flag?
  set players(value: Player[]); // TODO move to a flag?
  dealingPlayerIndex: number; // TODO move to a flag?
  setNextDealingPlayer(): void; // TODO move to a flag?
}
