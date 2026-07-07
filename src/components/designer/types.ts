import type {AnyComponentSchema} from '@open-formulieren/types';

export const COMPONENT_PLACEHOLDER_TYPE = 'componentPlaceholder';

/**
 * The component definition that is used in the FormDesigner. This can be a component
 * schema, or a placeholder for a new component.
 */
export type ComponentDefinition = AnyComponentSchema | ComponentPlaceholder;

/**
 * A temporary component placeholder used when adding a new component to a FormDesigner
 * dropzone.
 */
export interface ComponentPlaceholder {
  type: typeof COMPONENT_PLACEHOLDER_TYPE;
  componentType: AnyComponentSchema['type'];
}

/**
 * Configuration for a custom preset component.
 */
export type PresetComponentConfiguration = {
  key: string;
  label: string;
  icon: string;
  schema: AnyComponentSchema;
};

/**
 * A normalized component configuration, containing UI information and the component
 * schema.
 *
 * This is used to render the component in the designer.
 */
export type NormalizedComponentConfiguration = {
  key: string;
  label: string;
  icon: string;
  isDeprecated?: boolean;
  schema: AnyComponentSchema;
};

/**
 * A normalized component group, containing the group name and the components in that group.
 *
 * Because we support multiple group sources, backend-defined and custom preset groups,
 * we need to normalize the groups to a common format.
 *
 * For the backend-defined components, we use a statically defined collection of
 * component definitions.
 *
 * For the custom preset groups, we simply use the `PresetComponentConfiguration`
 * objects.
 */
export type NormalizedComponentGroups = {
  groupName: GroupName;
  components: NormalizedComponentConfiguration[];
};

/**
 * All supported component group names, including the 'preset' group.
 */
export type GroupName = ConfigurableGroupName | 'preset';

/**
 * The component group names that can be used in the builder group configuration in the
 * backend project.
 */
export type ConfigurableGroupName = 'basic' | 'layout' | 'special';

/**
 * The builder group configuration as it's available in the backend project.
 */
export interface ComponentGroup {
  /**
   * The technical name of the group.
   */
  name: ConfigurableGroupName;
  /**
   * The components that should be shown in the group. If a component is not listed here, it
   * will not be shown.
   */
  components: AnyComponentSchema['type'][];
}
