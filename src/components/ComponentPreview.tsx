import {ExtendedComponentSchema} from 'formiojs/types/components/schema';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import {JSONType} from '@types';

interface JSONPreviewProps {
  data: JSONType;
  className?: string;
}

const JSONPreview: React.FC<JSONPreviewProps> = ({data, className = ''}) => (
  <pre className={className}>{JSON.stringify(data, null, 2)}</pre>
);

export interface ComponentPreviewProps {
  component: ExtendedComponentSchema;
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({component}) => {
  return (
    <div className="card panel preview-panel">
      <div className="card-header">
        <h4 className="card-title mb-0">
          <FormattedMessage description="Component preview card title" defaultMessage="Preview" />
        </h4>
      </div>
      <div className="card-body" style={{maxHeight: '45vh', overflow: 'auto'}}>
        <div className="component-preview">
          <JSONPreview data={component} />
        </div>
      </div>
    </div>
  );
};

export default ComponentPreview;
