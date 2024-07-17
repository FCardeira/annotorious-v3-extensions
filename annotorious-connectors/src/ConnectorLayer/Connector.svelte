<script lang="ts">
  import { onMount } from 'svelte';
  import type { SvelteImageAnnotatorState } from '@annotorious/annotorious';

  /** Props */
  export let from: string;
  export let state: SvelteImageAnnotatorState;
  export let to: string;

  const { store } = state;

  onMount(() => {
    // Observe changes to start- and end-annotation
    store.observe(event => {
      // We'll only check for 'updated' events and ignore delete (handled upwards in the layer)
      const { updated } = event.changes;

      console.log('update', updated);
      
    }, { annotations: [from, to]});
  });
</script>