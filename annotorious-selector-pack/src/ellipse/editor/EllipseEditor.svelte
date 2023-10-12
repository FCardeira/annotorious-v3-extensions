<script type="ts">
  import { Handle, Editor } from '@annotorious/annotorious/src';
  import type { Ellipse, Transform } from '@annotorious/annotorious';

  export let shape: Ellipse;

  export let transform: Transform;

  export let viewportScale: number = 1;

  $: geom = shape.geometry;

  $: handleSize = 10 / viewportScale;

  const editor = (rectangle: Ellipse, handle: Handle, delta: [number, number]) => {
    const initialBounds = rectangle.geometry.bounds;

    let [x0, y0] = [initialBounds.minX, initialBounds.minY];
    let [x1, y1] = [initialBounds.maxX, initialBounds.maxY];

    const [dx, dy] = delta;

    if (handle === Handle.SHAPE) {
      x0 += dx;
      x1 += dx;
      y0 += dy;
      y1 += dy;
    } else {
      switch (handle) {
        case Handle.TOP:
        case Handle.TOP_LEFT:
        case Handle.TOP_RIGHT: {
          y0 += dy;
          break;
        }

        case Handle.BOTTOM:
        case Handle.BOTTOM_LEFT:
        case Handle.BOTTOM_RIGHT: {
          y1 += dy;
          break;
        }
      }

      switch (handle) {
        case Handle.LEFT:
        case Handle.TOP_LEFT:
        case Handle.BOTTOM_LEFT: {
          x0 += dx;
          break;
        }

        case Handle.RIGHT:
        case Handle.TOP_RIGHT:
        case Handle.BOTTOM_RIGHT: {
          x1 += dx;
          break;
        }
      }
    }

    const x = Math.min(x0, x1);
    const y = Math.min(y0, y1);
    const w = Math.abs(x1 - x0);
    const h = Math.abs(y1 - y0);

    return {
      ...rectangle,
      geometry: {
        x, y, w, h,
        bounds: {
          minX: x,
          minY: y,
          maxX: x + w,
          maxY: y + h
        }
      }
    };
  }
</script>

<Editor
  shape={shape}
  transform={transform}
  editor={editor}
  on:grab
  on:change 
  on:release
  let:grab={grab}>

  <ellipse 
    class="a9s-outer"
    on:pointerdown={grab(Handle.SHAPE)}
    cx={geom.cx} cy={geom.cy} rx={geom.rx} ry={geom.ry} />

  <ellipse 
    class="a9s-inner a9s-shape-handle"
    on:pointerdown={grab(Handle.SHAPE)}
    cx={geom.cx} cy={geom.cy} rx={geom.rx} ry={geom.ry} />

  <!-- 
  <rect 
    class="a9s-corner-handle a9s-corner-topl"
    on:pointerdown={grab(Handle.TOP_LEFT)}
    x={c.x - handleSize / 2} y={geom.y - handleSize / 2} height={handleSize} width={handleSize} />

  <rect 
    class="a9s-corner-handle a9s-corner-handle-topright"
    on:pointerdown={grab(Handle.TOP_RIGHT)}
    x={geom.x + geom.w - handleSize / 2} y={geom.y - handleSize / 2} height={handleSize} width={handleSize} />
  
  <rect 
    class="a9s-corner-handle a9s-corner-handle-bottomright"
    on:pointerdown={grab(Handle.BOTTOM_RIGHT)}
    x={geom.x + geom.w - handleSize / 2} y={geom.y + geom.h - handleSize / 2} height={handleSize} width={handleSize} />
    
  <rect 
    class="a9s-corner-handle a9s-corner-handle-bottomleft"
    on:pointerdown={grab(Handle.BOTTOM_LEFT)}
    x={geom.x - handleSize / 2} y={geom.y + geom.h - handleSize / 2} height={handleSize} width={handleSize} />
  -->
</Editor>