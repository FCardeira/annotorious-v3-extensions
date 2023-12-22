import { v4 as uuidv4 } from 'uuid';
import { ShapeType, type ImageAnnotation } from '@annotorious/annotorious';
import type { RectangleGeometry } from '@annotorious/annotorious';
import type { Page } from './Types';

const parseTextLine = (t: Element): ImageAnnotation[] => {

  const annotations: ImageAnnotation[] = [];

  for (const str of t.querySelectorAll('String')) {
    // Example: <String ID="S3" CONTENT="a." HPOS="1979" VPOS="228" WIDTH="84" HEIGHT="92" STYLEREFS="TS1" WC="0.1"/>
    const id = str.getAttribute('ID') || uuidv4();
    const content = str.getAttribute('CONTENT');
    const minX = parseFloat(str.getAttribute('HPOS'));
    const minY = parseFloat(str.getAttribute('VPOS'));
    const w = parseFloat(str.getAttribute('WIDTH'));
    const h = parseFloat(str.getAttribute('HEIGHT'));

    const maxX = minX + w;
    const maxY = minY + h;

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

  return annotations;

}

export const parseALTO = (xmlText: string): Page => {
  const parser = new DOMParser();

  const doc = parser.parseFromString(xmlText, 'application/xml');

  const page = doc.querySelector('Page');

  const annotations = [];

  for (const line of doc.querySelectorAll('TextLine')) {
    annotations.push(...parseTextLine(line));
  }

  const id = page.getAttribute('ID');
  const height = parseFloat(page.getAttribute('HEIGHT'));
  const width = parseFloat(page.getAttribute('WIDTH')); 

  return { annotations, metadata: { id, height, width }};
}