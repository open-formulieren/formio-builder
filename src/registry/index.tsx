import React from 'react';

import {EditFormComponentSchema} from '@types';
import {JSONType} from '@types';

interface EditFormDefinition<P> extends React.FC<P> {
  defaultValues: {
    [key: string]: JSONType;
  };
}

interface EditFormProps {
  component: EditFormComponentSchema;
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
