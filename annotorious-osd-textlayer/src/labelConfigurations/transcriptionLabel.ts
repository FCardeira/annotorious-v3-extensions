import type { ImageAnnotation } from '@annotorious/annotorious';

export const transcriptionLabel = (annotation: ImageAnnotation) =>
  annotation.bodies.find(b => b.purpose === 'transcribing')?.value;