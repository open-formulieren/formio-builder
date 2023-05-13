import {ExtendedComponentSchema} from 'formiojs';
import React from 'react';
import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {ComponentPreviewProps} from '@/components/ComponentPreview';
import {EditFormComponentSchema} from '@/types';

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
    editSchema: (intl: IntlShape) => z.ZodFirstPartySchemaTypes;
    preview: React.FC<ComponentPreviewProps>;
    // textfield -> string, numberfield -> number etc. This is used for the formik
    // initial data
    defaultValue: unknown;
  };
}

const REGISTRY: Registry = {
  textfield: TextField,
};

export default REGISTRY;
export {Fallback};
