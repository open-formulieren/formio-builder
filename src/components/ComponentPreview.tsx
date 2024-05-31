import {JSONEditor} from '@open-formulieren/monaco-json-editor';
import clsx from 'clsx';
import {Formik, useFormikContext} from 'formik';
import React, {useState} from 'react';
import {FormattedMessage} from 'react-intl';

import {Fallback, getRegistryEntry, isKnownComponentType} from '@/registry';
import {AnyComponentSchema, FallbackSchema, hasOwnProperty} from '@/types';

import './componentJsonEdit.scss';

/*
  Generic preview (preview + wrapper with view mode)
 */

export interface ComponentPreviewWrapperProps {
  component: AnyComponentSchema | FallbackSchema;
  /** Initial values for the preview component, e.g. `{"componentKey": "some_value"}` */
  initialValues: Record<string, unknown>;
  /** Handler to be called when the component JSON definition changes */
  onComponentChange: (value: any) => void;
  children: React.ReactNode;
}

const ComponentPreviewWrapper: React.FC<ComponentPreviewWrapperProps> = ({
  component,
  initialValues,
  onComponentChange,
  children,
}) => {
  const [previewMode, setpreviewMode] = useState<PreviewState>('rich');

  return (
    <div className="card panel preview-panel">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="card-title mb-0">
          <FormattedMessage description="Component preview card title" defaultMessage="Preview" />
        </h4>
        <PreviewModeToggle
          mode={previewMode}
          onChange={event => setpreviewMode(event.target.value as PreviewState)}
        />
      </div>
      <div className="card-body">
        {previewMode === 'JSON' ? (
          <JSONEditor
            wrapperProps={{className: 'component-json-edit'}}
            value={component}
            onChange={onComponentChange}
          />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export interface GenericComponentPreviewProps {
  component: AnyComponentSchema | FallbackSchema;
  onComponentChange: (value: any) => void;
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
  const key = isKnownComponentType(component) ? component.key : '';
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
      {isKnownComponentType(component) ? (
        <PreviewComponent component={component} />
      ) : (
        <Fallback.preview component={component} />
      )}
    </ComponentPreviewWrapper>
  );
};

export type PreviewState = 'rich' | 'JSON';

interface PreviewModeToggleProps {
  mode: PreviewState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PreviewModeToggle: React.FC<PreviewModeToggleProps> = ({mode, onChange}) => {
  const isRichPreview = mode === 'rich';
  const isJSON = mode === 'JSON';
  return (
    <div className="btn-group btn-group-toggle">
      <label className={clsx('btn', 'btn-sm', 'btn-secondary', {active: isRichPreview})}>
        <input
          type="radio"
          name="previewMode"
          value="rich"
          autoComplete="off"
          checked={isRichPreview}
          onChange={onChange}
        />
        <FormattedMessage description="Component 'Rich' preview mode" defaultMessage="Form" />
      </label>
      <label className={clsx('btn', 'btn-sm', 'btn-secondary', {active: isJSON})}>
        <input
          type="radio"
          name="previewMode"
          value="JSON"
          autoComplete="off"
          checked={isJSON}
          onChange={onChange}
        />
        <FormattedMessage
          description="Component 'editJSON' preview mode"
          defaultMessage="Edit JSON"
        />
      </label>
    </div>
  );
};

export default GenericComponentPreview;
