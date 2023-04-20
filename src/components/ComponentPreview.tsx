import clsx from 'clsx';
import React, {useState} from 'react';
import {FormattedMessage} from 'react-intl';

import {ExtendedEditFormComponentSchema, JSONType} from '@types';

import REGISTRY from '../registry';

interface JSONPreviewProps {
  data: JSONType;
  className?: string;
}

const JSONPreview: React.FC<JSONPreviewProps> = ({data, className = ''}) => (
  <pre className={className} data-testid="jsonPreview">
    {JSON.stringify(data, null, 2)}
  </pre>
);

export interface ComponentPreviewProps {
  component: ExtendedEditFormComponentSchema;
}

const Fallback: React.FC<ComponentPreviewProps> = ({component}) => <JSONPreview data={component} />;

type PreviewState = 'rich' | 'JSON';

const ComponentPreview: React.FC<ComponentPreviewProps> = ({component}) => {
  const [previewMode, setpreviewMode] = useState<PreviewState>('rich');
  const componentType = component.type || 'OF_MISSING_TYPE';
  const Preview = REGISTRY?.[componentType]?.preview || Fallback;
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
        <div className="component-preview" data-testid="componentPreview">
          {previewMode === 'rich' ? (
            <Preview component={component} />
          ) : (
            <JSONPreview data={component} />
          )}
        </div>
      </div>
    </div>
  );
};

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
