import type { Annotation, AnnotationTarget } from '@annotorious/annotorious';

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
