import { AnnotoriousPlugin } from '@annotorious/react';
import { mountPlugin } from '@annotorious/plugin-connectors';

export const ConnectorPlugin = () => {

  return (
    <AnnotoriousPlugin plugin={mountPlugin} />
  )

}