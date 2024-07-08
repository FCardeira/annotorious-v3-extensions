export type Point = { x: number, y: number };

export type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

export type Orientation = 'HORIZONTAL' | 'VERTICAL';

export interface ConnectionHandle {

  point: Point;

  direction: Direction;

}

interface BaseConnection {

  start: ConnectionHandle;

  segments: ConnectionSegment[];

}

export interface ConnectionSegment {

  direction: Direction;

  length: 'FULL' | 'HALF';

}

export interface PinnedConnection extends BaseConnection {

  end: ConnectionHandle;

}

export interface FloatingConnection extends BaseConnection {

  end: Point;

}

export type Connection = PinnedConnection | FloatingConnection;