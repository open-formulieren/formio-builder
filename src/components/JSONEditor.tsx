import type {JSONEditor as ActualJSONEditor} from '@open-formulieren/monaco-json-editor';
import {Suspense, lazy} from 'react';

const LazyJSONEditor = lazy(async () => {
  const monacoJsonEditor = await import('@open-formulieren/monaco-json-editor');
  return {default: monacoJsonEditor.JSONEditor};
});

const JSONEditor = (props: React.ComponentProps<typeof ActualJSONEditor>) => (
  <Suspense fallback="Loading editor...">
    <LazyJSONEditor {...props} />
  </Suspense>
);

export default JSONEditor;
