<script lang="ts">
  import { writable } from 'svelte/store';
  import { offset, flip, shift, type VirtualElement, type ClientRectObject } from 'svelte-floating-ui/dom';
  import { createFloatingActions } from 'svelte-floating-ui';
  import type {  AnnotatorState, ImageAnnotation, Selection, StoreChangeEvent } from '@annotorious/annotorious';
  import Comment from "./Comment.svelte";

  export let container: HTMLImageElement;
  export let state: AnnotatorState<ImageAnnotation>;

  const { selection, store } = state; 

  let storeObserver: (event: StoreChangeEvent<ImageAnnotation>) => void;

  const isSelected = (selection: Selection) => selection.selected?.length > 0;

  const [ floatingRef, floatingContent ] = createFloatingActions({
    strategy: 'absolute',
    placement: 'bottom-start',
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
  floatingRef(virtualElement);

  $: $selection, onSelect();

  const onSelect = () => {
    if (storeObserver)
      store.unobserve(storeObserver);

    if (isSelected($selection)) {
      setPosition($selection);

      storeObserver = () => setPosition($selection);

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

    virtualElement.set({ getBoundingClientRect });
  }
</script>

{#if isSelected($selection)}
  <div class="a9s-popup" use:floatingContent>
    <Comment />
    <div>
      <button>Cancel</button> <button>Ok</button>
    </div>
  </div>
{/if}

<style>
  .a9s-popup {
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 
      0 0 3px -1px rgba(0, 0, 0, 0.6),
      2px 2px 42px rgba(0, 0, 0, 0.25);
    padding: 0.5rem;
    position: absolute;
    z-index: 990;
  }
</style>