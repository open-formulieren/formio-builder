import {DateComponentSchema} from '@open-formulieren/types';

import JSONPreview from '@/components/JSONPreview';

import {ComponentPreviewProps} from '../types';

const Preview: React.FC<ComponentPreviewProps<DateComponentSchema>> = ({component}) => (
  <JSONPreview data={component} />
);

export default Preview;
