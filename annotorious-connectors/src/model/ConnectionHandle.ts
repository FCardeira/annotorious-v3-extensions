import type { Point } from './Point';

export type Direction = 'N' | 'E' | 'S' | 'W';

export interface FloatingConnectionHandle {

  point: Point;

}

export interface PinnedConnectionHandle extends FloatingConnectionHandle {

  direction: Direction;

}

export type ConnectionHandle = FloatingConnectionHandle | PinnedConnectionHandle;