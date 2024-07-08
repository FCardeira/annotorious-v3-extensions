<script lang="ts">
  import { getSVGPoint, type ImageAnnotation, type SvelteImageAnnotatorState } from '@annotorious/annotorious';
  import RubberbandConnector from './RubberbandConnector.svelte';
  import type { Direction, Point } from 'src/Types';
  import { getMidpoints } from '../elbow';
  import { getClosest, getClosestPair, getStartDirection } from './geom';

  /** Props */
  export let source: ImageAnnotation | undefined;
  export let state: SvelteImageAnnotatorState;

  /** Responsive scaling **/
  let svgEl: SVGSVGElement;

  /** Elbow connector start & end points **/
  let start: Point | undefined;
  let startDirection: Direction | undefined;
  let end: Point | undefined;
  let endDirection: Direction | undefined;

  const { store } = state;

  const onPointerMove = (evt: PointerEvent) => {
    if (!source) return;

    const pt = getSVGPoint(evt, svgEl);

    const sourceMidpoints = getMidpoints(source);

    const target = store.getAt(pt.x, pt.y);
    if (target) {
      // Connect source annotation with target annotation
      const targetMidpoints = getMidpoints(target);
      const { from , to } = getClosestPair(sourceMidpoints, targetMidpoints);
      start = from;
      startDirection = getStartDirection(source, from);
      end = to;
      endDirection = getStartDirection(target, to);
    } else {
      // Connect source annotation with mouse position
      start = getClosest(sourceMidpoints, pt);
      startDirection = getStartDirection(source, pt);
      end = pt;
      endDirection = undefined;
    }
  }
</script>

<svg 
  bind:this={svgEl}
  class="a9s-connectors"
  class:active={source}
  on:pointermove={onPointerMove}>
  <g>
    <RubberbandConnector
      start={start} 
      startDirection={startDirection} 
      end={end} 
      endDirection={endDirection} />
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
