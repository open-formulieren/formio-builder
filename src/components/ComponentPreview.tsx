import React from 'react';
import {FormattedMessage} from 'react-intl';

import {ExtendedEditFormComponentSchema, JSONType} from '@types';

import REGISTRY from '../registry';

interface JSONPreviewProps {
  data: JSONType;
  className?: string;
}

const JSONPreview: React.FC<JSONPreviewProps> = ({data, className = ''}) => (
  <pre className={className}>{JSON.stringify(data, null, 2)}</pre>
);

export interface ComponentPreviewProps {
  component: ExtendedEditFormComponentSchema;
}

const Fallback: React.FC<ComponentPreviewProps> = ({component}) => <JSONPreview data={component} />;

const ComponentPreview: React.FC<ComponentPreviewProps> = ({component}) => {
  const componentType = component.type || 'OF_MISSING_TYPE';
  const Preview = REGISTRY?.[componentType].preview || Fallback;
  return (
    <div className="card panel preview-panel">
      <div className="card-header">
        <h4 className="card-title mb-0">
          <FormattedMessage description="Component preview card title" defaultMessage="Preview" />
        </h4>
      </div>
      <div className="card-body" style={{maxHeight: '45vh', overflow: 'auto'}}>
        <div className="component-preview">
          <Preview component={component} />
        </div>
      </div>
    </div>
  );
};

export default ComponentPreview;
