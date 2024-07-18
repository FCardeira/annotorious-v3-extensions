import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import type { AnnotatorState, ImageAnnotation } from '@annotorious/annotorious';

interface Link {

  id: string;

  from: string;

  to: string; 

}

export type ConnectionGraph = ReturnType<typeof createConnectionGraph>;

export const createConnectionGraph = (state: AnnotatorState<ImageAnnotation>) => {

  const { subscribe, set } = writable<Link[]>([]);

  let links: Link[] = [];

  subscribe(l => links = l);

  const addLink = (from: string, to: string) => {
    const id = uuidv4();
    const link = { id, from, to };

    set([...links, {...link}]);

    return link;
  }

  return {
    addLink,
    links,
    subscribe
  }

}