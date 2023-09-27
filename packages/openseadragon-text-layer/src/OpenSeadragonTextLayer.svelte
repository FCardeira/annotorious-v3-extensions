<script type="ts">
  import type { ImageAnnotation, ImageAnnotatorState } from '@annotorious/openseadragon';
  import { onMount } from 'svelte';
  import ScaledText from './OpenSeadragonScaledText.svelte';
  import type { TextLayerOpts } from '.';
    
  /** props **/
  export let state: ImageAnnotatorState;
  export let viewer: OpenSeadragon.Viewer;
  export let opts: TextLayerOpts;

  const { store } = state;

  let transform: string;

  let scale: number;

  let annotations: ImageAnnotation[] = [];

  const { offsetWidth, offsetHeight } = viewer.canvas;

  const redraw = () => {
    const viewportBounds = viewer.viewport.viewportToImageRectangle(viewer.viewport.getBounds(true));

    const containerWidth = viewer.viewport.getContainerSize().x;
    const zoom = viewer.viewport.getZoom(true);
    scale = zoom * containerWidth / viewer.world.getContentFactor();

    const rotation = Math.PI * viewer.viewport.getRotation() / 180;

    const dx = - viewportBounds.x * scale;
    const dy = - viewportBounds.y * scale;

    let offsetX: number, offsetY: number;

    if (rotation > 0 && rotation <= Math.PI / 2) {
      offsetX = viewportBounds.height * scale;
      offsetY = 0;
    } else if (rotation > Math.PI / 2 && rotation <= Math.PI) {
      offsetX = viewportBounds.width * scale;
      offsetY = viewportBounds.height * scale;
    } else if (rotation > Math.PI && rotation <= Math.PI * 1.5) {
      offsetX = 0;
      offsetY = viewportBounds.width * scale;
    } else {
      offsetX = 0;
      offsetY = 0;
    }

    const tx = offsetX + dx * Math.cos(rotation) - dy * Math.sin(rotation);
    const ty = offsetY + dx * Math.sin(rotation) + dy * Math.cos(rotation);

    transform = `translate(${tx}px, ${ty}px) rotate(${rotation}) scale(${scale})`;
  }

  onMount(() => {
    viewer.addHandler('update-viewport', redraw);

    return () => {
      viewer.removeHandler('update-viewport', redraw);
    }
  });

  store.observe(event => {
    annotations = event.state;
    redraw();
  });
</script>

<div 
  style={`transform:${transform}; width: ${offsetWidth / 0.11}px; height: ${offsetHeight / 0.11}px`}
  class="a9s-annotationlayer a9s-osd-textlayer">
  {#each annotations as annotation}
    <ScaledText 
      annotation={annotation} 
      opts={opts} />
  {/each}
</div>

<style>
  div {
    transform-origin: 0 0;
  }
</style>