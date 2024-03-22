import type { ImageAnnotation, ImageAnnotatorState } from '@annotorious/annotorious';
import type { OpenSeadragonAnnotator } from '@annotorious/openseadragon';
import { parseALTO } from '@annotorious/formats';
import type { OCRFormat, TextLayerOpts } from './Types';
import OpenSeadragonTextLayer from './TextLayer.svelte';
import { getImageDimensions, scaleAnnotations } from './ImageDimensions';

import './textLayerExtension.css';

export const mountExtension = (
  anno: OpenSeadragonAnnotator<ImageAnnotation>, 
  opts: TextLayerOpts
) => {
  // @ts-ignore
  const { viewer, state } = anno;

  let _visible = opts.defaultVisible === undefined ? true : opts.defaultVisible;

  let _locked = false;

  // @ts-ignore
  const textLayer = new OpenSeadragonTextLayer({
    target: viewer.element.querySelector('.openseadragon-canvas')!,
    props: { state: state as ImageAnnotatorState, viewer, opts, visible: _visible }
  });

  const isVisible = () => _visible;

  const isLocked = () => _locked;

  const loadOCR = (url: string, format: OCRFormat = 'ALTO') => fetch(url)
    .then(res => res.text())
    .then(xml => {
      const { annotations, metadata } = parseALTO(xml);

      getImageDimensions(viewer).then(dimensions => {
        const { scaled, scaleY, scaleX } = scaleAnnotations(annotations, metadata, dimensions);

        if (!opts.fontSize && metadata.avgLineWidth && metadata.avgCharsPerLine) {
          // No user-defined font size - automatic!
          // const fontSize = metadata.averageLineHeight * scaleY * 0.5;
          const fontSize = 0.8 * scaleX * (metadata.avgLineWidth / metadata.avgCharsPerLine);

          textLayer.$set({ opts: { ...opts, fontSize }});
        }

        anno.setAnnotations(scaled);
      });
    });

  const setLocked = (locked: boolean) => {
    _locked = locked;
    viewer.setMouseNavEnabled(!locked);

    // @ts-ignore
    textLayer.$set({ captureEvents: locked });
  }

  const setVisible = (visible: boolean) => {
    _visible = visible;

    textLayer.$set({ visible });
  }

  const unmount = () => textLayer.$destroy();

  return {
    isLocked,
    isVisible,
    loadOCR,
    setLocked,
    setVisible,
    unmount
  }

}