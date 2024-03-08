import { ShapeType } from '@annotorious/annotorious';
import type { ImageAnnotation, PolygonGeometry, RectangleGeometry, Shape } from '@annotorious/annotorious';
import type { PageMetadata } from '@annotorious/formats';
import type OpenSeadragon from 'openseadragon';

export interface ImageDimensions {

  height: number;

  width: number;

}

export const getImageDimensions = (
  viewer: OpenSeadragon.Viewer
): Promise<ImageDimensions> => new Promise(resolve => {
  if (viewer.world.getItemAt(0)?.source) {
    // Image already loaded - resolve immediately
    const { x, y } = viewer.world.getItemAt(0).source.dimensions;
    resolve({ width: x, height: y });
  } else {
    // Attach onOpen handler and resolve then
    const getDimensions = () => {
      const { x, y } = viewer.world.getItemAt(0).source.dimensions;

      viewer.removeHandler('open', getDimensions);

      resolve({ width: x, height: y });
    }

    viewer.addHandler('open', getDimensions);
  }
});

const scaleShape = (shape: Shape, kx: number, ky: number): Shape => {
  const { bounds } = shape.geometry;

  const minX = bounds.minX * kx;
  const minY = bounds.minY * ky;
  const maxX = bounds.maxX * kx;
  const maxY = bounds.maxY * ky;

  if (shape.type === ShapeType.RECTANGLE) {
    return {
      type: ShapeType.RECTANGLE,
      geometry: {
        bounds: { minX, minY, maxX, maxY },
        x: minX,
        y: minY,
        w: maxX - minX, 
        h: maxY - minY
      } as RectangleGeometry
    }
  } else if (shape.type === ShapeType.POLYGON) {
    return {
      type: ShapeType.POLYGON,
      geometry: {
        bounds: { minX, minY, maxX, maxY },
        points: (shape.geometry as PolygonGeometry)
          .points.map(([x, y]) => ([x * kx, y * ky]))
      } as PolygonGeometry
    }
  } else  {
    console.error('Unsupported shape type', shape);
    return shape;
  }
}

export const scaleAnnotations = (
  a: ImageAnnotation[], 
  page: PageMetadata, 
  dim: ImageDimensions
): {
  scaled: ImageAnnotation[],
  scaleX: number,
  scaleY: number
} => {
  const pageWidth = page.width;
  const pageHeight = page.height;

  const imgWidth = dim.width;
  const imgHeight = dim.height;

  if (pageWidth && pageHeight) {
    const scaleX = imgWidth / pageWidth;
    const scaleY = imgHeight / pageHeight;

    if (scaleX === 1 && scaleY === 1) {
      // No need to scale
      return { scaled: a, scaleX, scaleY };
    } else {
      console.log('[TextLayerExtension] Page and image are different size - scaling annotations');

      const scaled = a.map(annotation => ({
        ...annotation,
        target: {
          ...annotation.target,
          selector: scaleShape(annotation.target.selector, scaleX, scaleY)
        }
      }));

      return { scaled, scaleX, scaleY };
    }
  } else {
    console.warn('[TextLayerExtension] Cannot scale annotations without page dimensions');
    return { scaled: a, scaleX: 1, scaleY: 1 };
  }
}
