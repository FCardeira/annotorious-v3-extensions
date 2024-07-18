<script lang="ts">
  import { v4 as uuidv4 } from 'uuid';
  import { getSVGPoint } from '@annotorious/annotorious';
  import type { Annotation, ImageAnnotation, StoreChangeEvent, SvelteImageAnnotatorState } from '@annotorious/annotorious';
  import { getConnection } from '../layout';
  import type { Connection, ConnectionAnnotation, ConnectionHandle, PinnedConnectionHandle } from '../model';
  import type { ConnectionGraph } from '../state';
  import Connector from './Connector.svelte';
  import RubberbandConnector from './RubberbandConnector.svelte';
    import { onMount } from 'svelte';

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

      const id = uuidv4();

      const annotation: ConnectionAnnotation = {
        id,
        motivation: 'linking',
        bodies: [],
        target: {
          annotation: id,
          selector: { from, to }
        }
      }

      // @ts-ignore
      store.addAnnotation(annotation);

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

  onMount(() => {
    const onChange = (event: StoreChangeEvent<Annotation>) => {
      const { created, updated, deleted } = event.changes;

      // @ts-ignore
      const addedConnections = (created || []).filter(a => a.motivation === 'linking');
      console.log('adding', addedConnections);
    }

    store.observe(onChange);

    return () => {
      store.unobserve(onChange);
    }
  });
</script>

<svg 
  bind:this={svgEl}
  class="a9s-connector-layer"
  class:active={source}
  on:pointermove={onPointerMove}
  on:pointerdown={onPointerDown}>
  <g class="a9s-connectors">
    {#each $graph as link}
      <Connector
        from={link.from}
        to={link.to} 
        state={state} />
    {/each}
  </g>

  {#if connection}
    <g class="a9s-rubberband">
      <RubberbandConnector 
        connection={connection} />
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
