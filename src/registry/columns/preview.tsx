import {css} from '@emotion/css';
import {ColumnsComponentSchema} from '@open-formulieren/types';

import {ComponentPreviewProps} from '../types';

// XXX: once we've moved away from bootstrap/formio 'component library', clean up the
// styles setup for preview and remove @emotion/css again.

/**
 * Show a formio columns component preview.
 */
const Preview: React.FC<ComponentPreviewProps<ColumnsComponentSchema>> = ({component}) => {
  const {columns} = component;
  return <>Configured {columns.length} columns</>;
};

export default Preview;
