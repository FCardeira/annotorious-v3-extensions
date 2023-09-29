import type { AnnotoriousOpenSeadragonAnnotator, ImageAnnotatorState } from '@annotorious/openseadragon';
import OpenSeadragonTextLayer from './TextLayer.svelte';
import type { TextLayerOpts } from './TextLayerOpts';

import './textLayerExtension.css';

export const mountExtension = (anno: AnnotoriousOpenSeadragonAnnotator, opts: TextLayerOpts) => {

  const { viewer, state } = anno;

  const textLayer = new OpenSeadragonTextLayer({
    target: viewer.element.querySelector('.openseadragon-canvas'),
    props: { state: state as ImageAnnotatorState, viewer, opts }
  });

  const unmount = () => textLayer.$destroy();

  return {
    unmount
  }

}