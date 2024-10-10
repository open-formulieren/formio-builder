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

// Component schema-specific input validation for the edit form

export interface EditSchemaArgs {
  intl: IntlShape;
  builderContext: BuilderContextType;
}

export type EditSchema = (args: EditSchemaArgs) => z.ZodFirstPartySchemaTypes;

// Component / form previewing

export interface ComponentPreviewProps<S extends AnyComponentSchema = AnyComponentSchema> {
  component: S;
}

export interface StructureSubtreeProps<S extends AnyComponentSchema = AnyComponentSchema> {
  component: S;
  renderSubtree: (components: AnyComponentSchema[]) => React.ReactNode;
}

export interface WebformPreviewProps<S extends AnyComponentSchema = AnyComponentSchema> {
  component: S;
  renderSubtree: (components: AnyComponentSchema[]) => React.ReactNode;
}

// Integration with simple-conditional.

export interface ComparisonValueProps {
  name: string;
  label: React.ReactNode;
  multiple?: boolean;
}

// Registry entry

export interface Previews {
  /**
   * The component preview rendered next to the component configuration form.
   *
   * The preview updates live as the component configuration itself is modified through
   * form field interaction.
   */
  panel: React.FC<ComponentPreviewProps> | null;
  /**
   * The rendered structure of the children of a component.
   *
   * Component types that act as containers can render their structural preview with
   * this component.
   *
   * The prop `renderSubtree` prop is a callback function taking a list of nested
   * components and will render their structure preview.
   */
  structureSubtree?: React.FC<StructureSubtreeProps>;

  /**
   * The component preview rendered as part of the whole form definition.
   *
   * The form can be interacted with to give an impression of the published form in the
   * SDK, but the goal is NOT to implement the SDK here too. If not specified, then
   * the `panel`` preview will be rendered.
   */
  webform?: React.FC<WebformPreviewProps>;
}

export interface RegistryEntry<S extends AnyComponentSchema> {
  edit: EditFormDefinition<S>;
  editSchema: EditSchema;
  preview: Previews;
  /**
   * Return a summary to act as (string) representation of the component.
   */
  getSummary?: (component: S) => React.ReactNode;
  // textfield -> string, numberfield -> number etc. This is used for the formik
  // initial data
  defaultValue: unknown; // TODO: there must be a way to grab S['defaultValue'] if it's set...
  comparisonValue?: React.FC<ComparisonValueProps>;
}

// Registry made up of registry entries, one for each possible component schema

export type Registry = {
  [S in AnyComponentSchema as S['type']]: RegistryEntry<S>;
};
