<script lang="ts">
  import type { ImageAnnotation, SvelteImageAnnotatorState } from '@annotorious/annotorious';

  export let start: ImageAnnotation | undefined;
  export let state: SvelteImageAnnotatorState;

  $: console.log(start);
</script>

<svg class="a9s-connectors">
  <g></g>
</svg>

<style>
  svg {
    height: 100%;
    left: 0px;
    position: absolute;
    top: 0px;
    pointer-events: none;
    width: 100%;
  }
</style>
