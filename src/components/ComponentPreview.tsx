import clsx from 'clsx';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {FormattedMessage} from 'react-intl';

import REGISTRY from '@/registry';
import {ExtendedEditFormComponentSchema, JSONType} from '@/types';

/*
  Generic JSON Preview
  -> move to utils?
 */

interface JSONPreviewProps {
  data: JSONType;
  className?: string;
}

const JSONPreview: React.FC<JSONPreviewProps> = ({data, className = ''}) => (
  <pre className={className} data-testid="jsonPreview">
    {JSON.stringify(data, null, 2)}
  </pre>
);

/*
  Fallback component preview component, for when no suitable preview is defined.

  TODO: I think the types currently require this to be defined, so should this even
  exist? Maybe we should just throw an exception if you're trying to render a component
  type that's not in the registry?
 */

const Fallback: React.FC<ComponentPreviewProps> = ({component}) => <JSONPreview data={component} />;

/*
  Generic preview (preview + wrapper with view mode)
 */

export interface ComponentPreviewWrapperProps {
  component: ExtendedEditFormComponentSchema;
  initialValues: Record<string, unknown>;
  children: React.ReactNode;
}

const ComponentPreviewWrapper: React.FC<ComponentPreviewWrapperProps> = ({
  component,
  initialValues,
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
      <div className="card-body" style={{maxHeight: '45vh', overflow: 'auto'}}>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={() => {
            throw new Error("Can't submit preview form");
          }}
        >
          <div className="component-preview" data-testid="componentPreview">
            {previewMode === 'rich' ? children : <JSONPreview data={component} />}
          </div>
        </Formik>
      </div>
    </div>
  );
};

export interface ComponentPreviewProps {
  component: ExtendedEditFormComponentSchema;
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
const ComponentPreview: React.FC<ComponentPreviewProps> = ({component}) => {
  const componentType = component.type || 'OF_MISSING_TYPE';
  const PreviewComponent = REGISTRY?.[componentType]?.preview || Fallback;
  const defaultValue = REGISTRY?.[componentType]?.defaultValue || '';
  const key = component.key || 'OF_MISSING_KEY';
  const initialValues = {[key]: component.multiple ? [] : defaultValue};

  return (
    <ComponentPreviewWrapper component={component} initialValues={initialValues}>
      <PreviewComponent component={component} />
    </ComponentPreviewWrapper>
  );
};

type PreviewState = 'rich' | 'JSON';

interface PreviewModeToggleProps {
  mode: PreviewState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PreviewModeToggle: React.FC<PreviewModeToggleProps> = ({mode, onChange}) => {
  const isRichPreview = mode === 'rich';
  const isJSONPreview = mode === 'JSON';
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
    </div>
  );
};

export default ComponentPreview;
