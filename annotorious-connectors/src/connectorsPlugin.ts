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
      source: undefined,
      state: anno.state as SvelteImageAnnotatorState
    }
  });

  const onSelectionChanged = (selection: ImageAnnotation[]) => {
    const selected = (selection || [])[0];
    connectorLayer.$set({ source: selected });
  }

  anno.on('selectionChanged', onSelectionChanged);

  const unmount = () => {
    anno.off('selectionChanged', onSelectionChanged);
  }

  return { 
    unmount
  }

}