import { ConnectorLayer } from './ConnectorLayer';
import { createConnectionGraph } from './state/ConnectionGraph';
import type { 
  ImageAnnotator,
  ImageAnnotation, 
  SvelteImageAnnotatorState 
} from '@annotorious/annotorious';

export const mountPlugin = (anno: ImageAnnotator) => {

  const graph = createConnectionGraph(anno.state);

  let isEnabled = false;

  const connectorLayer = new ConnectorLayer({
    target: anno.element,
    props: {
      graph,
      source: undefined,
      state: anno.state as SvelteImageAnnotatorState
    }
  });

  const onSelectionChanged = (selection: ImageAnnotation[]) => {
    if (isEnabled) {
      const selected = (selection || [])[0];
      connectorLayer.$set({ source: selected });
    }
  }

  anno.on('selectionChanged', onSelectionChanged);

  /** API **/

  const setEnabled = (enabled: boolean) => {
    isEnabled = enabled;
    connectorLayer.$set({ source: undefined });
  }

  const unmount = () => {
    anno.off('selectionChanged', onSelectionChanged);
  }

  return { 
    setEnabled,
    unmount
  }

}