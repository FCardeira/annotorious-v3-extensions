<script lang="ts">
  import type OpenSeadragon from 'openseadragon';
  import type { SvelteImageAnnotatorState } from '@annotorious/annotorious';
  import type { ImageAnnotation } from '@annotorious/openseadragon';
  import ConnectorLayer from '../ConnectorLayer/ConnectorLayer.svelte';
  import OSDSVGLayer from './OSDSVGLayer.svelte';

  export let source: ImageAnnotation | undefined;
  export let state: SvelteImageAnnotatorState;
  export let viewer: OpenSeadragon.Viewer;
</script>

<OSDSVGLayer 
  viewer={viewer} 
  let:transform 
  let:scale>

  <ConnectorLayer 
    scale={scale}
    source={source}
    state={state} 
    transform={transform} />

</OSDSVGLayer>