import type OpenSeadragon from 'openseadragon';
import OSDConnectorLayer from './OSDConnectorLayer.svelte';
import type { 
  ImageAnnotation,
  ImageAnnotator,
  SvelteImageAnnotatorState
} from '@annotorious/annotorious';

export const mountOSDPlugin = (anno: ImageAnnotator, viewer: OpenSeadragon.Viewer) => {

  const { store, selection } = anno.state;

  let isEnabled = false;

  const connectorLayer = new OSDConnectorLayer({
    target: viewer.element.querySelector('.openseadragon-canvas')!,
    props: {
      source: undefined as ImageAnnotation | undefined,
      state: anno.state as SvelteImageAnnotatorState,
      viewer
    }
  });

  const unsubscribe = selection.subscribe(({ selected }) => {
    if (isEnabled && selected.length > 0) {
      const source = store.getAnnotation(selected[0].id);
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