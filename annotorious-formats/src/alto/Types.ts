import type { ImageAnnotation } from '@annotorious/annotorious/src/model';

export interface Page {

  annotations: ImageAnnotation[];

  metadata: PageMetadata;

}

export interface PageMetadata {

  id?: string; 
  
  height?: number;

  width?: number;
  
}