import type {ContentComponentSchema} from '@open-formulieren/types';

import type {ComponentPreviewProps} from '../types';
import './designer-preview.scss';

const Preview: React.FC<ComponentPreviewProps<ContentComponentSchema>> = ({component}) => {
  const {html, key} = component;

  return <div dangerouslySetInnerHTML={{__html: html}} data-testid={`input-${key}`} />;
};

export default Preview;
