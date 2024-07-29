import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { Annotorious } from '@annotorious/react';

import '@annotorious/react/annotorious-react.css';

const root = createRoot(document.getElementById('root') as Element);
root.render(
  <React.StrictMode>
    <Annotorious>
      <App />
    </Annotorious>
  </React.StrictMode>
);