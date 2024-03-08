import { v4 as uuidv4 } from 'uuid';
import { ShapeType, type ImageAnnotation } from '@annotorious/annotorious';
import type { RectangleGeometry } from '@annotorious/annotorious';
import type { Page } from './Types';

const parseTextLine = (
  t: Element
): { annotations: ImageAnnotation[], averageHeight: number } => {
  const annotations: ImageAnnotation[] = [];

  // Sum up the individual word heights, so we can 
  // compute average line height in the end
  let wordHeightSum = 0;

  const strings = t.querySelectorAll('String');

  for (const str of strings) {
    // Example: <String ID="S3" CONTENT="a." HPOS="1979" VPOS="228" WIDTH="84" HEIGHT="92" STYLEREFS="TS1" WC="0.1"/>
    const id = str.getAttribute('ID') || uuidv4();
    const content = str.getAttribute('CONTENT');
    const minX = parseFloat(str.getAttribute('HPOS'));
    const minY = parseFloat(str.getAttribute('VPOS'));
    const w = parseFloat(str.getAttribute('WIDTH'));
    const h = parseFloat(str.getAttribute('HEIGHT'));

    const maxX = minX + w;
    const maxY = minY + h;

    wordHeightSum += h;

    annotations.push({
      id,
      bodies: [{
        id,
        annotation: id,
        purpose: 'transcribing',
        value: content
      }],
      target: {
        annotation: id,
        selector: {
          type: ShapeType.RECTANGLE,
          geometry: {
            bounds: { minX, minY, maxX, maxY },
            x: minX,
            y: minY,
            w, 
            h
          } as RectangleGeometry
        }
      }
    })
  }

  return { annotations, averageHeight: wordHeightSum / strings.length };
}

export const parseALTO = (xmlText: string): Page => {
  const annotations = [];

  // Sum up average line height, so we can compute
  // global average line across the page in the end
  let lineHeightSum = 0;

  const parser = new DOMParser();

  const doc = parser.parseFromString(xmlText, 'application/xml');

  const page = doc.querySelector('Page');

  const textLines = doc.querySelectorAll('TextLine');

  for (const line of textLines) {
    const { annotations: lineAnnotations, averageHeight } = parseTextLine(line);

    lineHeightSum += averageHeight;

    annotations.push(...lineAnnotations);
  }

  const id = page.getAttribute('ID');
  const height = parseFloat(page.getAttribute('HEIGHT'));
  const width = parseFloat(page.getAttribute('WIDTH')); 

  const averageLineHeight = lineHeightSum / textLines.length;

  return { annotations, metadata: { id, height, width, averageLineHeight }};
}