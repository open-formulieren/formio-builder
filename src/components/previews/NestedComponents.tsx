import {AnyComponentSchema} from '@open-formulieren/types';

import StructurePreview from './StructurePreview';
import WebformPreview from './WebformPreview';
import {PreviewMode} from './types';

const getRenderComponent = (previewMode: PreviewMode) => {
  switch (previewMode) {
    case 'structure': {
      return StructurePreview;
    }
    case 'webform': {
      return WebformPreview;
    }
  }
};

interface NestedComponentsProps {
  components: AnyComponentSchema[];
  previewMode: PreviewMode;
}

const NestedComponents: React.FC<NestedComponentsProps> = ({components, previewMode}) => {
  const Component = getRenderComponent(previewMode);
  return (
    <>
      {components.map(component => (
        <Component key={component.id} component={component} />
      ))}
    </>
  );
};

export default NestedComponents;
