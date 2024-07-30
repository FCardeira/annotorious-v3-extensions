<script lang="ts">
  import { onMount } from 'svelte';
  import { v4 as uuidv4 } from 'uuid';
  import { getSVGPoint } from '@annotorious/annotorious';
  import type { Annotation, ImageAnnotation, StoreChangeEvent, SvelteImageAnnotatorState } from '@annotorious/annotorious';
  import { getConnection } from '../layout';
  import type { Connection, ConnectionAnnotation, ConnectionHandle, PinnedConnectionHandle, Point } from '../model';
  import Connector from './Connector.svelte';
  import RubberbandConnector from './RubberbandConnector.svelte';

  /** Props */
  export let source: ImageAnnotation | undefined;
  export let state: SvelteImageAnnotatorState;
  export let layerTransform: string | undefined = undefined;
  export let pointerTransform: ((point: Point) => Point) | undefined = undefined;
  export let scale = 1;

  /** Responsive scaling **/
  let svgEl: SVGSVGElement;

  let connections: ConnectionAnnotation[] = [];

  let connection: Connection | undefined;

  $: if (!source) connection = undefined;

  const { selection, store } = state;

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

      source = undefined;
      connection = undefined;
    }
  }

  const onPointerMove = (evt: PointerEvent) => {
    if (!source) return;

    const pt: Point = pointerTransform 
      ? pointerTransform({ x: evt.offsetX, y: evt.offsetY })
      : getSVGPoint(evt, svgEl);

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
      const addedConnections: ConnectionAnnotation[] = (created || []).filter(a => a.motivation === 'linking');
      connections = [...connections, ...addedConnections];
    }

    store.observe(onChange);

    return () => {
      store.unobserve(onChange);
    }
  });

  // Shorthand
  $: isSelected = (id: string) => $selection.selected.some(s => s.id === id);
</script>

<svg 
  bind:this={svgEl}
  class="a9s-connector-layer"
  class:active={source}
  on:pointermove={onPointerMove}
  on:pointerdown={onPointerDown}>
  <g class="a9s-connectors" transform={layerTransform}>
    {#each connections as connection}
      <Connector
        annotation={connection}
        scale={scale}
        state={state} 
        isSelected={isSelected(connection.id)}/>
    {/each}


    {#if connection}
      <g class="a9s-rubberband">
        <RubberbandConnector 
          connection={connection} 
          scale={scale} />
      </g>
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
