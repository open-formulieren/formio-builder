import {SoftRequiredErrorsComponentSchema} from '@open-formulieren/types';

import {ComponentPreviewProps} from '../types';

const Preview: React.FC<ComponentPreviewProps<SoftRequiredErrorsComponentSchema>> = ({
  component,
}) => {
  const {html, key} = component;

  return <div dangerouslySetInnerHTML={{__html: html}} data-testid={`input-${key}`} />;
};

export default Preview;
