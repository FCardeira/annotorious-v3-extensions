<script lang="ts">
  import { getSVGPoint } from '@annotorious/annotorious';
  import type { ImageAnnotation, SvelteImageAnnotatorState } from '@annotorious/annotorious';
  import { computePath, getConnection } from './layout';
  import type { Point } from 'src/Types';

  /** Props */
  export let source: ImageAnnotation | undefined;
  export let state: SvelteImageAnnotatorState;

  /** Responsive scaling **/
  let svgEl: SVGSVGElement;

  let path: { start: Point, end: Point, d: string } | undefined;

  const { store } = state;

  const onPointerMove = (evt: PointerEvent) => {
    if (!source) return;

    const pt = getSVGPoint(evt, svgEl);

    const target = store.getAt(pt.x, pt.y);
    if (target) {
      const connection = getConnection(source, target);
      if (connection)
        path = computePath(connection, 6);
      else 
        path = undefined;
    } else {
      const connection = getConnection(source, { point: pt });
      path = computePath(connection, 6);
    }
  }
</script>

<svg 
  bind:this={svgEl}
  class="a9s-connectors"
  class:active={source}
  on:pointermove={onPointerMove}>
  <g>
    {#if path}
      <path class="a9s-path-outer" d={path.d} />  
      <path class="a9s-path-inner" d={path.d} />

      <circle class="a9s-path-handle-outer" cx={path.start.x} cy={path.start.y} r="4"/>
      <circle class="a9s-path-handle-inner" cx={path.start.x} cy={path.start.y} r="4"/>

      <circle class="a9s-path-handle-outer" cx={path.end.x} cy={path.end.y} r="4" />
      <circle class="a9s-path-handle-inner" cx={path.end.x} cy={path.end.y} r="4" />
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

  svg path {
    fill: transparent;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  svg path.a9s-path-outer {
    stroke: #00000040;
    stroke-width: 3.5px;
  }

  svg path.a9s-path-inner {
    stroke: #fff;
    stroke-width: 1.5px;
    stroke-dasharray: 3 3;
  }

  svg circle.a9s-path-handle-outer {
    fill: #00000040;
    stroke: #00000040;
    stroke-width: 3;
  }

  svg circle.a9s-path-handle-inner {
    stroke: #fff;
    stroke-width: 1.5;
    fill: #000;
  }
</style>
