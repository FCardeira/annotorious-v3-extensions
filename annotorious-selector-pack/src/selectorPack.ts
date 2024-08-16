import { ShapeType, type ImageAnnotator } from '@annotorious/annotorious';
import { type OpenSeadragonAnnotator } from '@annotorious/openseadragon';
import { EllipseEditor, RubberbandEllipse } from './ellipse';
import type { SvelteComponent } from 'svelte';

export const mountExtension = (
  anno: ImageAnnotator | OpenSeadragonAnnotator
) => {
  anno.registerDrawingTool('ellipse', RubberbandEllipse as typeof SvelteComponent);
  anno.registerShapeEditor(ShapeType.ELLIPSE, EllipseEditor as typeof SvelteComponent);
}