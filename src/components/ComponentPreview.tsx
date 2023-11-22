import clsx from 'clsx';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {Fallback, getRegistryEntry, isKnownComponentType} from '@/registry';
import {AnyComponentSchema, FallbackSchema, hasOwnProperty} from '@/types';

import JSONEdit from './JSONEdit';
import JSONPreview from './JSONPreview';

/*
  Generic preview (preview + wrapper with view mode)
 */

export interface ComponentPreviewWrapperProps {
  component: AnyComponentSchema | FallbackSchema;
  initialValues: Record<string, unknown>;
  children: React.ReactNode;
}

const ComponentPreviewWrapper: React.FC<ComponentPreviewWrapperProps> = ({
  component,
  initialValues,
  children,
}) => {
  const intl = useIntl();
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
        {previewMode === 'editJSON' ? (
          <JSONEdit
            data={component}
            rows={10}
            aria-label={intl.formatMessage({
              description: 'Accessible label for builder preview JSON edit field',
              defaultMessage: 'Edit component JSON',
            })}
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
              {previewMode === 'rich' ? (
                children
              ) : (
                <JSONPreview data={component} style={{maxBlockSize: '45vh'}} />
              )}
            </div>
          </Formik>
        )}
      </div>
    </div>
  );
};

export interface GenericComponentPreviewProps {
  component: AnyComponentSchema | FallbackSchema;
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
const GenericComponentPreview: React.FC<GenericComponentPreviewProps> = ({component}) => {
  const key = isKnownComponentType(component) ? component.key : '';
  const entry = getRegistryEntry(component);
  const {preview: PreviewComponent, defaultValue = ''} = entry;
  const isMultiple = hasOwnProperty(component, 'multiple') ? component.multiple : false;
  const componentDefaultValue = hasOwnProperty(component, 'defaultValue')
    ? component.defaultValue
    : defaultValue;

  const previewDefaultValue = isMultiple
    ? componentDefaultValue ?? []
    : componentDefaultValue ?? defaultValue;

  const initialValues = key ? {[key]: previewDefaultValue} : {};

  return (
    <ComponentPreviewWrapper component={component} initialValues={initialValues}>
      {isKnownComponentType(component) ? (
        <PreviewComponent component={component} />
      ) : (
        <Fallback.preview component={component} />
      )}
    </ComponentPreviewWrapper>
  );
};

type PreviewState = 'rich' | 'JSON' | 'editJSON';

interface PreviewModeToggleProps {
  mode: PreviewState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PreviewModeToggle: React.FC<PreviewModeToggleProps> = ({mode, onChange}) => {
  const isRichPreview = mode === 'rich';
  const isJSONPreview = mode === 'JSON';
  const isEditJSONPreview = mode === 'editJSON';
  return (
    <div className="btn-group btn-group-toggle">
      <label className={clsx('btn', 'btn-sm', 'btn-light', {active: isRichPreview})}>
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
      <label className={clsx('btn', 'btn-sm', 'btn-light', {active: isJSONPreview})}>
        <input
          type="radio"
          name="previewMode"
          value="JSON"
          autoComplete="off"
          checked={isJSONPreview}
          onChange={onChange}
        />
        <FormattedMessage description="Component 'JSON' preview mode" defaultMessage="JSON" />
      </label>
      <label className={clsx('btn', 'btn-sm', 'btn-light', {active: isEditJSONPreview})}>
        <input
          type="radio"
          name="previewMode"
          value="editJSON"
          autoComplete="off"
          checked={isEditJSONPreview}
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
