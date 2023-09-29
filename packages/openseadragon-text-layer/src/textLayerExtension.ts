import type { AnnotoriousOpenSeadragonAnnotator, ImageAnnotatorState } from '@annotorious/openseadragon';
import OpenSeadragonTextLayer from './TextLayer.svelte';
import type { TextLayerOpts } from './TextLayerOpts';

import './textLayerExtension.css';

export const mountExtension = (anno: AnnotoriousOpenSeadragonAnnotator, opts: TextLayerOpts) => {

  const { viewer, state } = anno;

  let _visible = true;

  const textLayer = new OpenSeadragonTextLayer({
    target: viewer.element.querySelector('.openseadragon-canvas'),
    props: { state: state as ImageAnnotatorState, viewer, opts }
  });

  const unmount = () => textLayer.$destroy();

  const setVisible = (visible: boolean) => {
    _visible = visible;
    textLayer.$$set({ visible });
  }

  const isVisible = () => _visible;

  return {
    isVisible,
    setVisible,
    unmount
  }

}