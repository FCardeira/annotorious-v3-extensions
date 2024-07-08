<script lang="ts">
  import { computeLines } from './layout';
  import type { PinnedConnection } from 'src/Types';

  export let connection: PinnedConnection;

  $: lines = computeLines(connection);
</script>

<g>
  {#each lines as line}
    <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="red" />
  {/each}
</g>