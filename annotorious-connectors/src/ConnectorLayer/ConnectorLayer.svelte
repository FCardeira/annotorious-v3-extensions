<script lang="ts">
  import { getSVGPoint } from '@annotorious/annotorious';
  import type { ImageAnnotation, SvelteImageAnnotatorState } from '@annotorious/annotorious';
  import { getConnection } from '../layout';
  import type { Connection, ConnectionHandle, PinnedConnectionHandle } from '../model';
  import type { ConnectionGraph } from '../state';
  import Connector from './RubberbandConnector.svelte';

  /** Props */
  export let graph: ConnectionGraph;
  export let source: ImageAnnotation | undefined;
  export let state: SvelteImageAnnotatorState;

  /** Responsive scaling **/
  let svgEl: SVGSVGElement;

  let connection: Connection | undefined;

  $: if (!source) connection = undefined;

  const { store } = state;

  const isPinned = (handle?: ConnectionHandle): handle is PinnedConnectionHandle => 
    handle !== undefined && 'direction' in handle;

  const onPointerDown = () => {
    if (isPinned(connection?.end)) {
      const from = connection.start.annotation.id;
      const to = connection.end.annotation.id;

      graph.addLink(from, to);

      source = undefined;
      connection = undefined;
    }
  }

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
  class="a9s-connector-layer"
  class:active={source}
  on:pointermove={onPointerMove}
  on:pointerdown={onPointerDown}>
  <g class="a9s-connectors">
    {#each graph.links as link}

    {/each}
  </g>

  {#if connection}
    <g class="a9s-rubberband">
      <Connector connection={connection} />
    </g>
  {/if}
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
