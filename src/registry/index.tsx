import {ComponentSchema} from 'formiojs/types/components/schema';
import React from 'react';

import {JSONType} from '@types';

interface EditFormDefinition<P> extends React.FC<P> {
  defaultValues: {
    [key: string]: JSONType;
  };
}

interface EditFormProps {
  component: ComponentSchema;
}

const Fallback: EditFormDefinition<EditFormProps> = ({component: {type}}) => (
  <div>Unknown component type: {type}</div>
);

Fallback.defaultValues = {};

interface Registry {
  [key: string]: EditFormDefinition<EditFormProps>;
}

const REGISTRY: Registry = {};

export default REGISTRY;
export {Fallback};
