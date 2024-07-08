<script lang="ts">
  import { writable } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import { v4 as uuidv4 } from 'uuid';
  import { offset, flip, shift, type VirtualElement, type ClientRectObject } from 'svelte-floating-ui/dom';
  import { createFloatingActions } from 'svelte-floating-ui';
  import type {  AnnotatorState, ImageAnnotation, Selection, StoreChangeEvent } from '@annotorious/annotorious';
  import Comment from './Comment.svelte';

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

  const getComment = (annotationId: string) => {
    const a = store.getAnnotation(annotationId);
    return (a?.bodies || []).find(b => b.purpose === 'commenting' || !b.purpose)?.value;
  }

  let comment: string | undefined;

  const onSelect = () => {
    if (storeObserver)
      store.unobserve(storeObserver);

    comment = getComment($selection.selected && $selection.selected[0]?.id);

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

  const onCancel = () => selection?.clear();

  const onSave = () => {
    if (!$selection || $selection.selected.length === 0) return; // Should never happen

    const selectedId = $selection.selected[0].id;

    const current = state.store.getAnnotation(selectedId);

    state.store.updateAnnotation(selectedId, {
      ...current,
      bodies: [
        ...(current?.bodies || []).filter(b => b.purpose !== 'commenting' && b.purpose),
        {
          annotation: selectedId,
          id: uuidv4(),
          purpose: 'commenting',
          value: comment
        }
      ]
    } as ImageAnnotation);

    selection.clear();
  }
</script>

{#if isSelected($selection)}
  <div class="a9s-popup" use:floatingContent transition:fade={{ duration: 120 }}>
    <Comment 
      bind:comment={comment} />

    <div class="a9s-popup-buttons">
      <button
        on:click={onCancel}>Cancel</button> 
        
      <button
        class="save"
        on:click={onSave}>Ok</button>
    </div>
  </div>
{/if}