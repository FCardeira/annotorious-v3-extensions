import type { Annotation, ImageAnnotator, ImageAnnotation } from '@annotorious/annotorious';
import { ConnectorLayer } from './ConnectorLayer';

export const mountPlugin = (anno: ImageAnnotator) => {

  console.log(anno);

  const connectorLayer = new ConnectorLayer({
    target: anno.element
  });

  const onMouseEnterAnnotation = (annotation: ImageAnnotation) => {
    console.log(annotation);
  }

  const onMouseLeaveAnnotation = (annotation: ImageAnnotation) => {
    console.log(annotation);
  }

  const onSelectionChanged = (selection: ImageAnnotation[]) => {
    const selected = (selection || [])[0];
    
    // Start drawing

  }

  anno.on('mouseEnterAnnotation', onMouseEnterAnnotation);
  anno.on('mouseLeaveAnnotation', onMouseLeaveAnnotation);
  anno.on('selectionChanged', onSelectionChanged);

  const unmount = () => {
    anno.off('mouseEnterAnnotation', onMouseEnterAnnotation);
    anno.off('mouseLeaveAnnotation', onMouseLeaveAnnotation);
    anno.off('selectionChanged', onSelectionChanged);
  }

  return { 
    unmount
  }

}