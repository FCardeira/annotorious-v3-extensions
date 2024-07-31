import { AnnotoriousOpenSeadragonAnnotator, AnnotoriousPlugin, useAnnotator, useViewer } from '@annotorious/react';
import { mountOSDPlugin } from '@annotorious/plugin-connectors';
import { useCallback, useMemo } from 'react';
import { ImageAnnotator } from '@annotorious/annotorious';

export const OSDConnectorPlugin = () => {

  const viewer = useViewer();

  const mountPlugin = useCallback((anno: ImageAnnotator) => mountOSDPlugin(anno, viewer), [viewer]);

  return (
    <AnnotoriousPlugin plugin={mountPlugin} />
  )

}