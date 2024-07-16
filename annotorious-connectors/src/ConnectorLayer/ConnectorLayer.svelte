<script lang="ts">
  import { getSVGPoint } from '@annotorious/annotorious';
  import type { ImageAnnotation, SvelteImageAnnotatorState } from '@annotorious/annotorious';
  import { getConnection } from '../layout';
  import Connector from './Connector.svelte';
  import type { Connection } from 'src/model/Connection';

  /** Props */
  export let source: ImageAnnotation | undefined;
  export let state: SvelteImageAnnotatorState;

  /** Responsive scaling **/
  let svgEl: SVGSVGElement;

  let connection: Connection | undefined;

  const { store } = state;

  const onPointerMove = (evt: PointerEvent) => {
    if (!source) return;

    const pt = getSVGPoint(evt, svgEl);

    const target = store.getAt(pt.x, pt.y);
    if (target)
      connection = getConnection(source, target);
    else
      connection = getConnection(source, { point: pt });
  }
</script>

<svg 
  bind:this={svgEl}
  class="a9s-connectors"
  class:active={source}
  on:pointermove={onPointerMove}>
  <g>
    {#if connection}
      <Connector connection={connection} />
    {/if}
  </g>
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

  svg.active {
    pointer-events: all;
  }
</style>
