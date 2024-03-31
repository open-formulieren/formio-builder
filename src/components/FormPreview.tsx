import {AnyComponentSchema} from '@open-formulieren/types';
import clsx from 'clsx';
import {ReactNode} from 'react';

import {getRegistryEntry} from '@/registry';

export interface RenderComponentProps {
  component: AnyComponentSchema;
}

export const RenderComponent: React.FC<RenderComponentProps> = ({component}) => {
  const entry = getRegistryEntry(component);
  const className = clsx(
    'offb-form-preview-component',
    `offb-form-preview-component--${component.type}`
  );

  // re-use the preview from the configuration edit modal
  // TODO: let more complicated components bring their own logic/presentation
  const {preview: PreviewComponent} = entry;

  const preview: ReactNode =
    PreviewComponent === null ? (
      `PREVIEW NOT AVAILABLE FOR COMPONENT TYPE '${component.type}'`
    ) : (
      <PreviewComponent component={component} />
    );

  return <div className={className}>{preview}</div>;
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
