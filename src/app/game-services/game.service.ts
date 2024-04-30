import { RoutingPath } from '../constants/routes';
import { Flag, FlagMapping } from './flags';

export type GameServiceWithFlags<K extends Flag> = GameService & { [P in K]: (x: FlagMapping[P]) => void } extends { [P in K]: (x: infer I) => void }
  ? I
  : never;

export interface GameService {
  readonly gameName: string;

  readonly startGameRoute: RoutingPath;

  readonly flags: Flag[];
  hasFlagActive<K extends Flag>(flag: K): this is GameServiceWithFlags<K>;
  isGameServiceWithFlags<K extends Flag[]>(flag: K): this is GameServiceWithFlags<K[number]>;
}
