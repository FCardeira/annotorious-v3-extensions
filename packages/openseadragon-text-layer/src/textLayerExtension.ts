import type { AnnotoriousOpenSeadragonAnnotator, ImageAnnotation, ImageAnnotatorState } from '@annotorious/openseadragon';
import { parseALTO } from '@annotorious/formats';
import OpenSeadragonTextLayer from './TextLayer.svelte';
import type { TextLayerOpts } from './TextLayerOpts';
import type { OCRFormat } from '.';

import './textLayerExtension.css';

export const mountExtension = (
  anno: AnnotoriousOpenSeadragonAnnotator<ImageAnnotation>, 
  opts: TextLayerOpts
) => {

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

  const loadOCR = (url: string, format: OCRFormat = 'ALTO') => fetch(url)
    .then(res => res.text())
    .then(xml => {
      const { annotations, metadata } = parseALTO(xml);
      anno.setAnnotations(annotations);
    });

  return {
    isVisible,
    loadOCR,
    setVisible,
    unmount
  }

}