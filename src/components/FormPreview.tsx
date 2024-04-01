import {css} from '@emotion/css';
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

const COMPONENT_CSS = css`
  border: dotted 1px var(--offb-form-preview-component-border-color, #ddd);

  &:hover {
    background-color: var(--offb-form-preview-component-hover-background-color, #eee);
  }
`;

export interface RenderComponentProps {
  component: AnyComponentSchema;
}

/**
 * Render a single component for the form preview.
 *
 * This component may be nested inside a parent component. The component configuration
 * is looked up in the registry, and the appropriate preview render handler is taken:
 *
 * 1. Check for an explicit form preview handler
 * 2. If not present, render the edit form preview handler
 * 3. Ultimately, fall back and display a message the component is unknown.
 */
export const RenderComponent: React.FC<RenderComponentProps> = ({component}) => {
  const entry = getRegistryEntry(component);
  const className = clsx(
    COMPONENT_CSS,
    'offb-form-preview-component',
    `offb-form-preview-component--${component.type}`,
    {
      'offb-form-preview-component--hidden': component.hidden,
    }
  );

  // re-use the preview from the configuration edit modal
  // TODO: let more complicated components bring their own logic/presentation
  const {preview: PreviewComponent, formPreview: FormPreviewComponent = undefined} = entry;
  const Component = FormPreviewComponent ?? PreviewComponent;

  const preview: ReactNode =
    Component === null ? (
      `PREVIEW NOT AVAILABLE FOR COMPONENT TYPE '${component.type}'`
    ) : (
      <Component component={component} />
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
      <div
        className="offb-form-preview-component__component"
        style={{flexGrow: '1', paddingInlineEnd: '10px'}}
      >
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

  // TODO: delegate this to the registry so that we can get default values for nested
  // components too (basically the equivalent of iter_components)
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
