<script type="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { ShapeType } from '@annotorious/annotorious';
  import type { Ellipse, Transform } from '@annotorious/annotorious';

  const dispatch = createEventDispatcher<{ create: Ellipse }>();
  
  export let transform: Transform;
  
  let container: SVGGElement;

  let origin: [x: number, y: number]; 

  let anchor: [number, number];

  let x: number, y: number, w: number, h: number;

  let isShiftPressed = false;

  let isCtrlPressed = false;

  let lastMoveEvent: PointerEvent;

  const onPointerDown = (evt: PointerEvent) => {
    origin = transform.elementToImage(evt.offsetX, evt.offsetY);
    anchor = origin;

    x = origin[0];
    y = origin[1];
    w = 1;
    h = 1;
  }

  const updateShape = (maybeEvent?: PointerEvent) => {
    const evt = maybeEvent || lastMoveEvent;

    if (origin) {
      anchor = transform.elementToImage(evt.offsetX, evt.offsetY);

      if (isCtrlPressed) {
        const mw = 2 * Math.abs(anchor[0] - origin[0]);
        const mh = 2 * Math.abs(anchor[1] - origin[1]);

        w = isShiftPressed ? Math.max(mw, mh) : mw;
        h = isShiftPressed ? w : mh;

        x = Math.min(anchor[0], origin[0] - w / 2);
        y = Math.min(anchor[1], origin[1] - h / 2);
      } else {
        const mw = Math.abs(anchor[0] - origin[0]);
        const mh = Math.abs(anchor[1] - origin[1]);

        w = isShiftPressed ? Math.max(mw, mh) : mw;
        h = isShiftPressed ? w : mh;

        x = Math.min(anchor[0], origin[0]);
        y = Math.min(anchor[1], origin[1]);
      }
    }

    if (maybeEvent)
      lastMoveEvent = maybeEvent;
  }
    
  const onPointerUp = () => {
    // Require 4x4 pixels minimum
    if (w * h > 15) {
      const shape: Ellipse = {
        type: ShapeType.ELLIPSE, 
        geometry: {
          bounds: {
            minX: x, 
            minY: y,
            maxX: x + w,
            maxY: y + h
          },
          cx: x + w / 2,
          cy: y + h / 2,
          rx: w / 2,
          ry: h / 2, 
          rotation: 0
        }
      }

      dispatch('create', shape);
    }

    origin = null;
    anchor = null;

    lastMoveEvent = undefined;
  }

  const onKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Shift') {
      isShiftPressed = true;  
      updateShape();  
    }

    if (evt.key === 'Control') {
      isCtrlPressed = true;
      updateShape();
    }
  }

  const onKeyUp = (evt: KeyboardEvent) => {
    if (evt.key === 'Shift') {
      isShiftPressed = false;
      updateShape();  
    }

    if (evt.key === 'Control') {
      isCtrlPressed = false;
      updateShape();  
    }
  }

  onMount(() => {
    const svg = container.closest('svg');

    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('keydown', onKeyDown);

    svg.addEventListener('pointerdown', onPointerDown);
    svg.addEventListener('pointermove', updateShape);
    svg.addEventListener('pointerup', onPointerUp);

    return () => {
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('keydown', onKeyDown);

      svg.removeEventListener('pointerdown', onPointerDown);
      svg.removeEventListener('pointermove', updateShape);
      svg.removeEventListener('pointerup', onPointerUp); 
    }
  });
</script>

<g 
  bind:this={container}
  class="a9s-annotation a9s-rubberband">
  
  {#if origin}
    <ellipse 
      class="a9s-outer"
      cx={x + w / 2} 
      cy={y + h / 2} 
      rx={w / 2} 
      ry={h / 2} />

    <ellipse 
      class="a9s-inner"
      cx={x + w / 2} 
      cy={y + h / 2} 
      rx={w / 2} 
      ry={h / 2} />
  {/if}
</g>