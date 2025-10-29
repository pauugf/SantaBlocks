import { FallingItemType } from './FallingItemType';
import { Position } from './Position';

export interface CatchedItem {
  type: FallingItemType,
  position: Position
}