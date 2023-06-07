import React from 'react';
import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {ComponentPreviewProps} from '@/components/ComponentPreview';
import {AnyComponentSchema} from '@/types';

import TextField from './textfield';

interface FallbackSchema {
  type?: string;
}

export interface EditFormProps<S> {
  component: S;
}

export interface EditFormDefinition<S> extends React.FC<EditFormProps<S>> {
  defaultValues: S extends AnyComponentSchema ? Omit<S, 'id' | 'type'> : FallbackSchema;
}

const Fallback: EditFormDefinition<FallbackSchema> = ({component: {type = 'unknown'}}) => (
  <div>Unknown component type: {type}</div>
);

Fallback.defaultValues = {};

type Registry = {
  // TODO: remove optional behaviour when all types are implemented
  [S in AnyComponentSchema as S['type']]?: {
    edit: EditFormDefinition<S>;
    editSchema: (intl: IntlShape) => z.ZodFirstPartySchemaTypes;
    preview: React.FC<ComponentPreviewProps<S>>;
    // textfield -> string, numberfield -> number etc. This is used for the formik
    // initial data
    defaultValue: unknown; // TODO: there must be a way to grab S['defaultValue'] if it's set...
  };
};

const REGISTRY: Registry = {
  textfield: TextField,
};

export default REGISTRY;
export {Fallback};
