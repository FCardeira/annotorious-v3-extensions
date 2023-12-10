import type { Annotator } from '@annotorious/svelte';
import ImagePopup from './ImagePopup/ImagePopup.svelte';
import type { ImageAnnotatorState } from '@annotorious/annotorious';

export const mountExtension = (anno: Annotator) => {

  const popup = new ImagePopup({
    target: document.body,
    props: { state: anno.state as ImageAnnotatorState }
  });

  const unmount = () => popup.$destroy();

  return () => {
    unmount
  }

}