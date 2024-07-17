<script lang="ts">
  import { computePath } from '../layout';
  import type { Connection } from 'src/model/Connection';

  export let connection: Connection;

  $: path = computePath(connection, 10);
</script>

<g class="a9s-connector">
  {#if path}
    <path class="a9s-connector-path-outer" d={path.d} />  
    <path class="a9s-connector-path-inner" d={path.d} />

    <circle class="a9s-connector-handle-outer" cx={path.start.x} cy={path.start.y} r="4"/>
    <circle class="a9s-connector-handle-inner" cx={path.start.x} cy={path.start.y} r="4"/>

    <circle class="a9s-connector-handle-outer" cx={path.end.x} cy={path.end.y} r="4" />
    <circle class="a9s-connector-handle-inner" cx={path.end.x} cy={path.end.y} r="4" />
  {/if}
</g>

<style>
  .a9s-connector path {
    fill: transparent;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  path.a9s-connector-path-outer {
    stroke: #00000040;
    stroke-width: 3.5px;
  }

  path.a9s-connector-path-inner {
    stroke: #fff;
    stroke-width: 1.5px;
    stroke-dasharray: 3 3;
  }

  circle.a9s-connector-handle-outer {
    fill: #00000040;
    stroke: #00000040;
    stroke-width: 3;
  }

  circle.a9s-connector-handle-inner {
    stroke: #fff;
    stroke-width: 1.5;
    fill: #000;
  }
</style>