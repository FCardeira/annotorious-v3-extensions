import type { ImageAnnotation } from '@annotorious/annotorious';
import type { ConnectionHandle, Direction, Orientation, PinnedConnection } from 'src/Types';

const getHandles = (annotation: ImageAnnotation): ConnectionHandle[] => {
  // TODO for prototyping, we're treating everything as a box...
  const { minX, minY, maxX, maxY } = annotation.target.selector.geometry.bounds;

  const w = maxX - minX;
  const h = maxY - minY;

  return [
    { point: { x: minX + w / 2, y: maxY }, direction: 'NORTH' }, // top
    { point: { x: maxX, y: minY + h / 2 }, direction: 'EAST' },  // right
    { point: { x: minX + w / 2, y: minY }, direction: 'SOUTH' }, // bottom
    { point: { x: minX, y: minY + h / 2 }, direction: 'WEST' }   // left
  ];
}

const orientation = (handle: ConnectionHandle): Orientation =>
  (handle.direction === 'EAST' || handle.direction === 'WEST') ? 'HORIZONTAL' : 'VERTICAL';

const invertDirection = (handle: ConnectionHandle): Direction =>
  handle.direction === 'EAST' ? 'WEST' :
  handle.direction === 'WEST' ? 'EAST' :
  handle.direction === 'SOUTH' ? 'NORTH' :
  'SOUTH';

const computePinnedConnection = (source: ConnectionHandle, target: ConnectionHandle): PinnedConnection => {
  if (orientation(source) === orientation(target)) {
    // S-connector
    const isUpward = target.point.y < source.point.y;
    const isLeft = target.point.x < source.point.x;

    return {
      start: source,
      segments: [{
        direction: source.direction,
        length: 'HALF'
      }, {
        direction: orientation(source) === 'VERTICAL' 
          ? isLeft ? 'WEST' : 'EAST'
          : isUpward ? 'NORTH' : 'SOUTH',
        length: 'FULL'
      }, {
        direction: invertDirection(target),
        length: 'HALF'
      }],
      end: target
    };
  } else {
    // L-connector
    return {
      start: source,
      segments: [{
        direction: source.direction,
        length: 'FULL'
      }, {
        direction: invertDirection(target),
        length: 'FULL'
      }],
      end: target
    };
  }
}

export const computeLayout = (source: ImageAnnotation, target: ImageAnnotation) => {
  // Step 1: compute all possible connections, between all cardinal directions (= 16 possibilities)
  const sourceHandles = getHandles(source);
  const targetHandles = getHandles(target);

  const connections: PinnedConnection[] = [];

  sourceHandles.forEach(sourceHandle => {
    targetHandles.forEach(targetHandle => {
      const connection = computePinnedConnection(sourceHandle, targetHandle);
      connections.push(connection);
    });
  });

  return connections;
}

type Line = { x1: number, y1: number, x2: number, y2: number };

export const computeLines = (connection: PinnedConnection) => {
  const w = Math.abs(connection.end.point.x - connection.start.point.x);
  const h = Math.abs(connection.end.point.y - connection.start.point.y);

  const lines = connection.segments.reduce<Line[]>((lines, segment) => {
    const prev = lines[lines.length - 1];

    const [x1, y1] = prev 
      ? [prev.x2, prev.y2] 
      : [connection.start.point.x, connection.start.point.y];

    let x2: number;
    let y2: number;

    if (segment.direction === 'NORTH') {
      x2 = x1;
      y2 = segment.length === 'HALF' ? y1 - h / 2 : y1 - h;
    } else if (segment.direction === 'EAST') {
      x2 = segment.length === 'HALF' ? x1 + w / 2 : x1 + w;
      y2 = y1;
    } else if (segment.direction === 'SOUTH') {
      x2 = x1;
      y2 = segment.length === 'HALF' ? y1 + h / 2 : y1 + h;
    } else {
      x2 = segment.length === 'HALF' ? x1 - w / 2 : x1 - w;
      y2 = y1;
    }

    return [...lines, { x1, y1, x2, y2 }]
  }, []);

  return lines;
}