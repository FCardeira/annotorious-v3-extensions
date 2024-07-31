import { AnnotoriousPlugin } from '@annotorious/react';
import { mountOSDPlugin } from '@annotorious/plugin-connectors';

export const OSDConnectorPlugin = () => {

  return (
    <AnnotoriousPlugin plugin={mountOSDPlugin} />
  )

}