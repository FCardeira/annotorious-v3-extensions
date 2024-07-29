import { ImageAnnotator, useAnnotator, W3CImageFormat } from '@annotorious/react';
import React, { useEffect, useState } from 'react';

export const App = () => {

  const [mode, setMode] = useState<'ANNOTATE' | 'RELATIONS'>('ANNOTATE');

  const anno = useAnnotator();

  useEffect(() => {
    if (!anno) return;

    anno.loadAnnotations('annotations.w3c.json');
  }, [anno]);

  return (
    <div id="content">
      <div>
        <button onClick={() => setMode(mode => mode === 'ANNOTATE' ? 'RELATIONS' : 'ANNOTATE')}>
          {mode === 'ANNOTATE' ? 'Annotate' : 'Relations'}
        </button>
      </div>

      <ImageAnnotator
        adapter={W3CImageFormat('640px-Hallstatt.jpg')}>
        <img src="640px-Hallstatt.jpg" />
      </ImageAnnotator>
    </div>
  )

}