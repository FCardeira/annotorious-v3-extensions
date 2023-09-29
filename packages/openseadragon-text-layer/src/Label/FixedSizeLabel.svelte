<script lang="ts">
  import type { ImageAnnotation } from '@annotorious/openseadragon';
  import type { TextLayerOpts } from '../TextLayerOpts';

  let ref: HTMLSpanElement;

  /** props **/
  export let annotation: ImageAnnotation;
  export let opts: TextLayerOpts;
  export let scale: number;

  $: b = annotation.target.selector.geometry.bounds;

  $: left = b.minX;
  $: top = b.maxY;
</script>

<div 
  class="annotation"
  style={`left:${left}px; top:${top}px; transform: scale(${1 / scale})`}>
  <span bind:this={ref}>
    {opts.label(annotation)}
  </span>&nbsp;<!-- ensures spaces between words on copy and paste! -->
</div>