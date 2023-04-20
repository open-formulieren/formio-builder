import {ExtendedComponentSchema} from 'formiojs';
import React from 'react';

import {ComponentPreviewProps} from '@components/ComponentPreview';
import {EditFormComponentSchema} from '@types';

import TextField from './textfield';

export interface EditFormDefinition<P, DVT = ExtendedComponentSchema> extends React.FC<P> {
  defaultValues: DVT;
}

export interface EditFormProps {
  component: EditFormComponentSchema;
}

const Fallback: EditFormDefinition<EditFormProps> = ({component: {type}}) => (
  <div>Unknown component type: {type}</div>
);

Fallback.defaultValues = {};

interface Registry {
  [key: string]: {
    edit: EditFormDefinition<EditFormProps>;
    preview: React.FC<ComponentPreviewProps>;
  };
}

const REGISTRY: Registry = {
  textfield: TextField,
};

export default REGISTRY;
export {Fallback};
