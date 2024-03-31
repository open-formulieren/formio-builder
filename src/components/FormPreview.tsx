import {AnyComponentSchema} from '@open-formulieren/types';

import {getRegistryEntry} from '@/registry';

interface RenderComponentProps {
  component: AnyComponentSchema;
}

const RenderComponent: React.FC<RenderComponentProps> = ({component}) => {
  const entry = getRegistryEntry(component);
  return <>{component.type}</>;
};

export interface FormPreviewProps {
  components: AnyComponentSchema[];
}

/**
 * Renders a preview of a Formio form definition.
 *
 * Pass the formio form configuration as an array of component definitions, and they
 * will be rendered in order (and recursively). Preview components get controls for
 * editing and some visual feedback about state (such as hidden/visible).
 */
const FormPreview: React.FC<FormPreviewProps> = ({components}) => (
  <>
    {components.map(component => (
      <RenderComponent component={component} />
    ))}
  </>
);

export default FormPreview;
