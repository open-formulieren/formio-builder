import {AnyComponentSchema} from '@open-formulieren/types';
import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {BuilderContextType} from '@/context';

// Edit form

export interface EditFormProps<S> {
  component: S;
}

export interface EditFormDefinition<S> extends React.FC<EditFormProps<S>> {
  // the ternary is a trick to force typescript to distribute unions inside S - otherwise
  // it will operate on the intersection of the union and it loses type information
  // for specific schemas
  defaultValues: S extends AnyComponentSchema ? Omit<S, 'id' | 'type'> : never;
}

// Component preview
export interface ComponentPreviewProps<S extends AnyComponentSchema> {
  component: S;
}

export type Preview<S extends AnyComponentSchema> = React.FC<ComponentPreviewProps<S>>;

export interface EditSchemaArgs {
  intl: IntlShape;
  builderContext: BuilderContextType;
}

export type EditSchema = (args: EditSchemaArgs) => z.ZodFirstPartySchemaTypes;

export interface ComparisonValueProps {
  name: string;
  label: React.ReactNode;
  multiple?: boolean;
}

// Registry entry

export interface RegistryEntry<S extends AnyComponentSchema> {
  edit: EditFormDefinition<S>;
  editSchema: EditSchema;
  preview: Preview<S> | null;
  // textfield -> string, numberfield -> number etc. This is used for the formik
  // initial data
  defaultValue: unknown; // TODO: there must be a way to grab S['defaultValue'] if it's set...
  comparisonValue?: React.FC<ComparisonValueProps>;
}

// Registry made up of registry entries, one for each possible component schema

export type Registry = {
  [S in AnyComponentSchema as S['type']]: RegistryEntry<S>;
};
