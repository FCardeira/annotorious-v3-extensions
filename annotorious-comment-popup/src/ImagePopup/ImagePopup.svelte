<script type="ts">
  import type { ImageAnnotation } from '@annotorious/annotorious';
  import type { Selection, StoreChangeEvent, SvelteAnnotatorState } from '@annotorious/svelte';

  // @ts-ignore
  export let state: SvelteAnnotatorState<ImageAnnotation>;

  let left: number;

  let top: number;

  let storeObserver: (event: StoreChangeEvent<ImageAnnotation>) => void;

  const { selection, store } = state; 

  const isSelected = (selection: Selection) => selection.selected?.length > 0;

  $: $selection, onSelect();

  const onSelect = () => {
    if (storeObserver)
      store.unobserve(storeObserver);

    if (isSelected($selection)) {
      setPosition($selection);

      storeObserver = (event: StoreChangeEvent<ImageAnnotation>) => {
        setPosition($selection);
      }

      store.observe(storeObserver, { annotations: $selection.selected.map(s => s.id) });
    }
  }

  const setPosition = (selection: Selection) => {
    // Note: this demo popup only supports a single selection
    const selectedId = selection.selected[0].id;
    const annotation = store.getAnnotation(selectedId);

    const { minX, minY, maxX, maxY } = annotation.target.selector.geometry.bounds;

    console.log('foo');

    // [left, top] = defaultStrategy(annotation, lastPointerDown);
    // left = bottomRight.x;
    // top = topLeft.y;

    left = 100;
    top = 100;
  }
</script>

{#if isSelected($selection)}
  <div 
    class="a9s-popup a9s-osd-popup"
    style={`top: ${top}px; left: ${left}px;`}>
    {$selection.selected.map(s => s.id).join(', ')}
  </div>
{/if}

<style>
  .a9s-osd-popup {
    background-color: #fff;
    border: 1px solid #a2a2a2;
    height: 250px;
    position: absolute;
    width: 400px;
    z-index: 1;
  }
</style>