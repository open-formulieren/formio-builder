import {AnyComponentSchema} from '@open-formulieren/types';
import clsx from 'clsx';
import {Formik} from 'formik';
import {set} from 'lodash';
import {ReactNode} from 'react';

import {getRegistryEntry} from '@/registry';
import {hasOwnProperty} from '@/types';

interface ActionIconProps {
  icon: string;
  label: string;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const ActionIcon: React.FC<ActionIconProps> = ({icon, label, onClick}) => (
  <a href="#" onClick={onClick}>
    <i className={`fa fa-fw fa-${icon}`} aria-label={label} />
  </a>
);

export interface RenderComponentProps {
  component: AnyComponentSchema;
}

export const RenderComponent: React.FC<RenderComponentProps> = ({component}) => {
  const entry = getRegistryEntry(component);
  const className = clsx(
    'offb-form-preview-component',
    `offb-form-preview-component--${component.type}`,
    {
      'offb-form-preview-component--hidden': component.hidden,
    }
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

  const onAction = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    alert('TODO');
  };

  return (
    <div
      className={className}
      style={{display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'stretch'}}
    >
      <div
        className="offb-form-preview-component__controls"
        style={{
          display: 'flex',
          gap: '3px',
          flexDirection: 'column',
          justifyContent: 'center',
          borderInlineEnd: 'dotted 1px #aaa',
          paddingInlineEnd: '4px',
        }}
      >
        <ActionIcon icon="pencil" label="Edit" onClick={onAction} />
        <ActionIcon icon="times" label="Delete" onClick={onAction} />
      </div>
      <div className="offb-form-preview-component__component" style={{flexGrow: '1'}}>
        {preview}
      </div>
    </div>
  );
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
const FormPreview: React.FC<FormPreviewProps> = ({components}) => {
  const initialValues: Record<string, unknown> = {};

  for (const component of components) {
    const entry = getRegistryEntry(component);
    const defaultValue = hasOwnProperty(component, 'defaultValue')
      ? component.defaultValue
      : entry.defaultValue ?? '';
    set(initialValues, component.key, defaultValue);
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={() => {
        window.alert("Can't submit a preview form.");
      }}
    >
      <>
        {components.map(component => (
          <RenderComponent key={component.id} component={component} />
        ))}
      </>
    </Formik>
  );
};

export default FormPreview;
