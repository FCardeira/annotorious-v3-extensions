<script lang="ts">
  import { roundCorners } from 'svg-round-corners';
  import type { Direction, Point } from 'src/Types';

  export let start: Point | undefined;
  export let startDirection: Direction | undefined;

  export let end: Point | undefined;
  export let endDirection: Direction | undefined;
</script>

{#if (start && end && startDirection)}
  {#if (endDirection)}
    <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="black" />
  {:else}
    {#if true}
      <path d={roundCorners(
        `M${start.x},${start.y} 
         H${end.x}
         V${end.y}`, 6
      ).path} stroke="black" fill="none" stroke-width={2} />
    {:else}
      <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="black" />
    {/if}
  {/if}
{/if}
