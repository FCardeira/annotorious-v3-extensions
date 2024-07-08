import type { ImageAnnotation } from '@annotorious/annotorious';
import type { Point } from './Types';

const isPoint = (target: any): target is Point =>
  target && typeof target.x === 'number' && typeof target.y === 'number';

export const getMidpoints = (annotation: ImageAnnotation): Point[] => {
  const { minX, minY, maxX, maxY } = annotation.target.selector.geometry.bounds;

  const w = maxX - minX;
  const h = maxY - minY;

  return [
    { x: minX + w / 2, y: maxY }, // top
    { x: maxX, y: minY + h / 2 }, // right
    { x: minX + w / 2, y: minY }, // bottom
    { x: minX, y: minY + h / 2 }  // left
  ];
}

const computePathLength = (start: Point, end: Point) => {
  // TODO - just a hack for now
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

const computeElbowConnector = (source: ImageAnnotation, target: ImageAnnotation | Point) => {
  const sources = getMidpoints(source);
  const targets = isPoint(target) ? [target] : getMidpoints(target);

  let shortestPathLength = Infinity;
  let bestStart: Point | undefined;
  let bestEnd: Point | undefined;

  sources.forEach(start => {
    targets.forEach(end => {
      const pathLength = computePathLength(start, end);
      if (pathLength < shortestPathLength) {
          shortestPathLength = pathLength;
          bestStart = start;
          bestEnd = end;
      }
    });
  });
  
  /*
  const pathData = `
    M${startPoint.x},${startPoint.y}
    V${(startPoint.y + endPoint.y) / 2}
    H${endPoint.x}
    V${endPoint.y}
  `;
  
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathData);
  path.setAttribute("stroke", "black");
  path.setAttribute("fill", "none");
  */
}