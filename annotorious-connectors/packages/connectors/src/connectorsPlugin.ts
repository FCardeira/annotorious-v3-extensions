import { ConnectorLayer } from './ConnectorLayer';
import type { 
  ImageAnnotation,
  ImageAnnotator,
  SvelteImageAnnotatorState
} from '@annotorious/annotorious';

export const mountPlugin = (anno: ImageAnnotator) => {

  const { store, selection } = anno.state;

  let isEnabled = false;

  const connectorLayer = new ConnectorLayer({
    target: anno.element,
    props: {
      source: undefined as ImageAnnotation | undefined,
      state: anno.state as SvelteImageAnnotatorState
    }
  });

  const unsubscribe = selection.subscribe(({ selected }) => {
    console.log('select', selected);
    if (isEnabled && selected.length > 0) {
      const source = store.getAnnotation(selected[0].id);
      console.log('new source', source);
      connectorLayer.$set(({ source }));
    }
  });

  /** API **/

  const setEnabled = (enabled: boolean) => {
    isEnabled = enabled;
    connectorLayer.$set({ source: undefined });
  }

  const unmount = () => {
    unsubscribe();
  }

  return { 
    setEnabled,
    unmount
  }

}