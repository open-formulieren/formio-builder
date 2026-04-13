import type {AnyComponentSchema} from '@open-formulieren/types';

/**
 * Configuration for a custom preset component.
 */
export type PresetComponentDefinition = {
  key: string;
  label: string;
  icon: string;
  schema: AnyComponentSchema;
};

/**
 * A normalized component definition, containing UI information and the component schema.
 *
 * This is used to render the component in the designer.
 */
export type NormalizedComponentDefinition = {
  key: string;
  label: string;
  icon: string;
  isDeprecated?: boolean;
  schema: AnyComponentSchema;
};

/**
 * A normalized component group, containing the group name and the components in that group.
 *
 * Because we support multiple group sources, backend defined and custom preset groups,
 * we need to normalize the groups to a common format.
 *
 * For the backend defined `ComponentGroup`, we fetch the component definitions from the
 * backend project.
 *
 * For the custom preset groups, we simply use the `PresetComponentDefinition` objects.
 */
export type NormalizedComponentGroups = {
  groupName: GroupName;
  components: NormalizedComponentDefinition[];
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
