import type { 
  AnnotoriousOpenSeadragonAnnotator, 
  ImageAnnotation, 
  ImageAnnotatorState } from '@annotorious/openseadragon';
import OpenSeadragonTextLayer from './OpenSeadragonTextLayer.svelte';

export * from './presets';

export interface TextLayerOpts {

  label(annotation: ImageAnnotation): string | undefined;

  mode: 'fillBounds' | 'fixedSize';

  position: 'topleft' | 'bottomleft';

}

export const addTextLayer = (anno: AnnotoriousOpenSeadragonAnnotator, opts: TextLayerOpts) => {

  const { viewer, state } = anno;

  new OpenSeadragonTextLayer({
    target: viewer.element.querySelector('.openseadragon-canvas'),
    props: { state: state as ImageAnnotatorState, viewer, opts }
  });

}