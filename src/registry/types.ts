import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {BuilderContextType} from '@/context';
import {AnyComponentSchema, FallbackSchema} from '@/types';

// Edit form

export interface EditFormProps<S> {
  component: S;
}

export interface EditFormDefinition<S> extends React.FC<EditFormProps<S>> {
  defaultValues: S extends AnyComponentSchema ? Omit<S, 'id' | 'type'> : FallbackSchema;
}

// Component preview
export interface ComponentPreviewProps<S extends AnyComponentSchema | FallbackSchema> {
  component: S;
}

export type Preview<S extends AnyComponentSchema | FallbackSchema> = React.FC<
  ComponentPreviewProps<S>
>;

export interface EditSchemaArgs {
  intl: IntlShape;
  builderContext: BuilderContextType;
}

export type EditSchema = (args: EditSchemaArgs) => z.ZodFirstPartySchemaTypes;

// Registry entry

export interface RegistryEntry<S extends AnyComponentSchema | FallbackSchema> {
  edit: EditFormDefinition<S>;
  editSchema: EditSchema;
  preview: Preview<S> | null;
  // textfield -> string, numberfield -> number etc. This is used for the formik
  // initial data
  defaultValue: unknown; // TODO: there must be a way to grab S['defaultValue'] if it's set...
  comparisonValueComponent?: React.FC<comparisonValueComponentProps>;
}

// Registry made up of registry entries, one for each possible component schema

export type Registry = {
  [S in AnyComponentSchema as S['type']]: RegistryEntry<S>;
};
