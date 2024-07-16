export type Point = { x: number, y: number };

export type Direction = 'N' | 'E' | 'S' | 'W';

export interface FloatingConnectionHandle {

  point: Point;

}

export interface PinnedConnectionHandle extends FloatingConnectionHandle {

  direction: Direction;

}

export type ConnectionHandle = FloatingConnectionHandle | PinnedConnectionHandle;

export interface Connection {

  start: PinnedConnectionHandle;

  layout: string;

  end: ConnectionHandle | PinnedConnectionHandle;

}

export interface Path {

  start: Point;

  d: string;

  end: Point;

}