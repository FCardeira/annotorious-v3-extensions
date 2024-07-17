import { v4 as uuidv4 } from 'uuid';
import type { AnnotatorState, ImageAnnotation } from '@annotorious/annotorious';

export interface ConnectionGraph {

  addLink(from: string, to: string): Link;

  links: Link[];

  nodes: string[];

}

interface Link {

  id: string;

  from: string;

  to: string; 

}

export const createConnectionGraph = (state: AnnotatorState<ImageAnnotation>): ConnectionGraph => {

  // Annotation IDs
  const nodes: string[] = [];
  
  // Connection annotations (id, from, to)
  const links: Link[] = [];

  const addLink = (from: string, to: string) => {
    const id = uuidv4();
    const link = { id, from, to };

    links.push({...link});

    return link;
  }

  return {
    addLink,
    links,
    nodes
  }

}