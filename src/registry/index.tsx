import React from 'react';

import {EditFormComponentSchema} from '@types';
import {JSONType} from '@types';

import TextField from './textfield';

export interface EditFormDefinition<P> extends React.FC<P> {
  defaultValues: {
    [key: string]: JSONType;
  };
}

export interface EditFormProps {
  component: EditFormComponentSchema;
}

const Fallback: EditFormDefinition<EditFormProps> = ({component: {type}}) => (
  <div>Unknown component type: {type}</div>
);

Fallback.defaultValues = {};

interface Registry {
  [key: string]: EditFormDefinition<EditFormProps>;
}

const REGISTRY: Registry = {
  textfield: TextField,
};

export default REGISTRY;
export {Fallback};
