<script lang="ts">
  import type { ImageAnnotation } from '@annotorious/openseadragon';
  import type { TextLayerOpts } from '.';

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
    { opts.label(annotation) }
  </span>
</div>   

<style>
  div.annotation {
    transform-origin: 0 0;
    position: absolute;
    font-size: 14px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 3px 6px;
    border-radius: 2px;
  }
</style>