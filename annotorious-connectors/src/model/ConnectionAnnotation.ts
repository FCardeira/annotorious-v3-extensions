import type { Annotation, AnnotationTarget } from '@annotorious/annotorious';
import type { Point } from './Point';

export interface ConnectionAnnotation extends Annotation {

  motivation: 'linking';

  target: ConnectionAnnotationTarget;

}

export interface ConnectionAnnotationTarget extends AnnotationTarget {

  selector: {

    from: string;

    to: string;  
  }

}
