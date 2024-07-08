import ImagePopup from './ImagePopup/ImagePopup.svelte';
import type { ImageAnnotator } from '@annotorious/annotorious';

import './retro.css';

export const mountExtension = (image: HTMLImageElement, anno: ImageAnnotator) => {

  const popup = new ImagePopup({
    target: document.body,
    props: { 
      container: image,
      state: anno.state 
    }
  });

  const unmount = () => popup.$destroy();

  return () => {
    unmount
  }

}