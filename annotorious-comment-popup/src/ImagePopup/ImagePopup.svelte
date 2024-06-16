<script lang="ts">
  import { offset, flip, shift, type VirtualElement, type ClientRectObject } from "svelte-floating-ui/dom";
  import { createFloatingActions } from "svelte-floating-ui";
  import type { AnnotatorState, ImageAnnotation } from '@annotorious/annotorious';
  import type { Selection, StoreChangeEvent } from '@annotorious/annotorious';
    import { writable } from "svelte/store";

  export let state: AnnotatorState<ImageAnnotation>;

  export let container: HTMLImageElement;

  let storeObserver: (event: StoreChangeEvent<ImageAnnotation>) => void;

  const { selection, store } = state; 

  const isSelected = (selection: Selection) => selection.selected?.length > 0;

  $: $selection, onSelect();

  const [ floatingRef, floatingContent ] = createFloatingActions({
    strategy: "absolute",
    placement: "top",
    middleware: [
      offset(6),
      flip(),
      shift(),
    ]
  });

  let x = 0;
  let y = 0;
  let w = 0;
  let h = 0;

  $: getBoundingClientRect = (): ClientRectObject => {
    return {
      x,
      y,
      top: y,
      left: x,
      bottom: y + h,
      right: x,
      width: w,
      height: h
    }
  }

  const virtualElement = writable<VirtualElement>({ getBoundingClientRect })

  $: virtualElement.set({ getBoundingClientRect })

  floatingRef(virtualElement)

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

    if (!annotation) return;

    const offset = container.getBoundingClientRect();

    const scaleX = container.clientWidth / container.naturalWidth;
    const scaleY = container.clientHeight / container.naturalHeight;

    const { minX, minY, maxX, maxY } = annotation.target.selector.geometry.bounds;

    x = minX * scaleX + offset.left;
    y = minY * scaleY + offset.top;
    w = (maxX - minX) * scaleX;
    h = (maxY - minY) * scaleY;
  }
</script>

{#if isSelected($selection)}
  <div 
    class="a9s-popup a9s-osd-popup"
    style={`position: absolute`}
    use:floatingContent>
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