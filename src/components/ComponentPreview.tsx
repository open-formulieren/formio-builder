import {JSONEditor} from '@open-formulieren/monaco-json-editor';
import {Formik} from 'formik';
import React, {useContext, useState} from 'react';
import {FormattedMessage} from 'react-intl';

import PreviewModeToggle, {PreviewState} from '@/components/PreviewModeToggle';
import {BuilderContext} from '@/context';
import {getRegistryEntry} from '@/registry';
import {AnyComponentSchema, hasOwnProperty} from '@/types';

/*
  Generic preview (preview + wrapper with view mode)
 */

export interface ComponentPreviewWrapperProps {
  component: AnyComponentSchema;
  /** Initial values for the preview component, e.g. `{"componentKey": "some_value"}` */
  initialValues: Record<string, unknown>;
  /** Handler to be called when the component JSON definition changes */
  onComponentChange: (value: AnyComponentSchema) => void;
  children: React.ReactNode;
}

const ComponentPreviewWrapper: React.FC<ComponentPreviewWrapperProps> = ({
  component,
  initialValues,
  onComponentChange,
  children,
}) => {
  const [previewMode, setPreviewMode] = useState<PreviewState>('rich');
  const builderContext = useContext(BuilderContext);

  return (
    <div className="card panel preview-panel">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="card-title mb-0">
          <FormattedMessage description="Component preview card title" defaultMessage="Preview" />
        </h4>
        <PreviewModeToggle previewMode={previewMode} setPreviewMode={setPreviewMode} />
      </div>

      {previewMode === 'JSON' ? (
        <JSONEditor
          wrapperProps={{className: 'json-editor'}}
          value={component}
          onChange={onComponentChange}
          theme={builderContext.theme}
        />
      ) : (
        <div className="card-body">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={() => {
              throw new Error("Can't submit preview form");
            }}
          >
            <div className="component-preview" data-testid="componentPreview">
              {children}
            </div>
          </Formik>
        </div>
      )}
    </div>
  );
};

export interface GenericComponentPreviewProps {
  component: AnyComponentSchema;
  onComponentChange: (value: AnyComponentSchema) => void;
}

/**
 * Generic preview
 *
 * The preview component looks at the component.type and looks up the type-specific preview
 * component to render it, all while wrapping it in some builder-specific markup. It also
 * exposes controls to toggle between "WYSWIWYG" and JSON mode.
 *
 * It is also responsible for handling the `multiple: true` variants in a generic way.
 */
const GenericComponentPreview: React.FC<GenericComponentPreviewProps> = ({
  component,
  onComponentChange,
}) => {
  const {key} = component;
  const entry = getRegistryEntry(component);
  const {preview: PreviewComponent, defaultValue = ''} = entry;
  if (PreviewComponent === null) {
    return null;
  }
  const isMultiple = hasOwnProperty(component, 'multiple') ? component.multiple : false;
  const componentDefaultValue = hasOwnProperty(component, 'defaultValue')
    ? component.defaultValue
    : defaultValue;

  const previewDefaultValue = isMultiple
    ? componentDefaultValue ?? []
    : componentDefaultValue ?? defaultValue;

  const initialValues = key ? {[key]: previewDefaultValue} : {};

  return (
    <ComponentPreviewWrapper
      onComponentChange={onComponentChange}
      component={component}
      initialValues={initialValues}
    >
      <PreviewComponent component={component} />
    </ComponentPreviewWrapper>
  );
};

export default GenericComponentPreview;
