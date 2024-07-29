import type { Annotation } from '@annotorious/annotorious';
import type { Point } from './Point';

export type Direction = 'N' | 'E' | 'S' | 'W';

export interface FloatingConnectionHandle {

  point: Point;

}

export interface PinnedConnectionHandle extends FloatingConnectionHandle {

  annotation: Annotation;

  direction: Direction;

}

export type ConnectionHandle = FloatingConnectionHandle | PinnedConnectionHandle;