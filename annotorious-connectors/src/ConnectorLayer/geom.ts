import type { ImageAnnotation } from '@annotorious/annotorious';
import { getMidpoints } from '../elbow';
import type { Direction, Point } from 'src/Types';

const distSq = (a: Point, b: Point) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return dx * dx + dy * dy;
}

export const getClosest = (points: Point[], reference: Point): Point => {
  let closestPoint = points[0];
  let closestDistSq = distSq(points[0], reference);

  for (let i = 1;  i<points.length; i++) {
    const currentDistSq = distSq(points[i], reference);
    if (currentDistSq < closestDistSq) {
      closestDistSq = currentDistSq;
      closestPoint = points[i];
    }
  }

  return closestPoint;
}

export const getClosestPair = (points: Point[], reference: Point[]): { from: Point, to: Point } => {
  let closestPair: { from: Point, to: Point } = {
    from: points[0],
    to: reference[0]
  };

  let minDistSq = distSq(points[0], reference[0]);

  for (let i=0; i<points.length; i++) {
    for (let j=0; j<reference.length; j++) {
      const currentDistSq = distSq(points[i], reference[j]);
      if (currentDistSq < minDistSq) {
        minDistSq = currentDistSq;
        closestPair = {
          from: points[i],
          to: reference[j]
        };
      }
    }
  }

  return closestPair;
}

export const getStartDirection = (annotation: ImageAnnotation, point: Point): Direction => {
  const midpoints = getMidpoints(annotation);
  const closest = getClosest(midpoints, point);

  const index = midpoints.indexOf(closest);
  return (index % 2) === 0 ? 'VERTICAL' : 'HORIZONTAL';
}