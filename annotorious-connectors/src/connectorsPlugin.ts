import { ConnectorLayer } from './ConnectorLayer';
import type { 
  ImageAnnotator,
  ImageAnnotation, 
  SvelteImageAnnotatorState 
} from '@annotorious/annotorious';

export const mountPlugin = (anno: ImageAnnotator) => {

  const connectorLayer = new ConnectorLayer({
    target: anno.element,
    props: {
      start: undefined,
      state: anno.state as SvelteImageAnnotatorState
    }
  });

  const onMouseEnterAnnotation = (annotation: ImageAnnotation) => {
    console.log(annotation);
  }

  const onMouseLeaveAnnotation = (annotation: ImageAnnotation) => {
    console.log(annotation);
  }

  const onSelectionChanged = (selection: ImageAnnotation[]) => {
    const selected = (selection || [])[0];
    connectorLayer.$set({ start: selected });
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