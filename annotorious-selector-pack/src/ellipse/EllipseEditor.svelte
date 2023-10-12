<script type="ts">
  import { Handle, Editor } from '@annotorious/annotorious/src/annotation';
  import type { Transform } from '@annotorious/annotorious/src/annotation';
  import type { Ellipse } from '@annotorious/annotorious/src/model';
  
  export let shape: Ellipse;

  export let transform: Transform;

  export let viewportScale: number = 1;

  $: geom = shape.geometry;

  $: handleSize = 10 / viewportScale;

  const editor = (ellipse: Ellipse, handle: Handle, delta: [number, number]) => {
    const initialBounds = ellipse.geometry.bounds;

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
        case Handle.TOP: {
          y0 += dy;
          break;
        }

        case Handle.BOTTOM: {
          y1 += dy;
          break;
        }

        case Handle.LEFT: {
          x0 += dx;
          break;
        }

        case Handle.RIGHT: {
          x1 += dx;
          break;
        }
      }
    }

    const x = Math.min(x0, x1);
    const y = Math.min(y0, y1);
    const w = Math.abs(x1 - x0);
    const h = Math.abs(y1 - y0);

    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;

    const rx = w / 2;
    const ry = h / 2;

    return {
      ...ellipse,
      geometry: {
        ...ellipse.geometry,
        cx, cy, rx, ry,
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

  <rect 
    class="a9s-corner-handle a9s-corner-top"
    on:pointerdown={grab(Handle.TOP)}
    x={geom.cx - handleSize / 2} y={geom.cy - handleSize / 2 - geom.ry} height={handleSize} width={handleSize} />

  <rect 
    class="a9s-corner-handle a9s-corner-handle-right"
    on:pointerdown={grab(Handle.RIGHT)}
    x={geom.cx + geom.rx - handleSize / 2} y={geom.cy - handleSize / 2} height={handleSize} width={handleSize} />
  
  <rect 
    class="a9s-corner-handle a9s-corner-handle-bottom"
    on:pointerdown={grab(Handle.BOTTOM)}
    x={geom.cx - handleSize / 2} y={geom.cy + geom.ry - handleSize / 2} height={handleSize} width={handleSize} />
    
  <rect 
    class="a9s-corner-handle a9s-corner-handle-left"
    on:pointerdown={grab(Handle.LEFT)}
    x={geom.cx - geom.rx - handleSize / 2} y={geom.cy - handleSize / 2} height={handleSize} width={handleSize} />
</Editor>