import type {AnyComponentSchema} from '@open-formulieren/types';

import type {BuilderInfo} from '@/components/ComponentEditForm';

/**
 * The definition of a component, as it is available in the backend project.
 */
export type ComponentDefinition = {
  builderInfo: Omit<BuilderInfo, 'schema'> & {schema: AnyComponentSchema};
};

/**
 * Configuration for a custom preset component.
 */
export type PresetComponentDefinition = Pick<BuilderInfo, 'title' | 'schema'> & {
  key: string;
  icon: string;
};

/**
 * The supported component group names.
 */
export type GroupName = 'custom' | 'custom_layout' | 'custom_special';

/**
 * The builder group configuration as its available in the backend project.
 */
export interface ComponentGroup {
  /**
   * Whether the group should be expanded by default. If no default group is set, the first
   * group will be expanded.
   */
  default?: true;
  /**
   * The title of the group.
   */
  title: string;
  /**
   * The technical name of the group.
   */
  name: GroupName;
  /**
   * The weight of the group.
   */
  weight: number;
  /**
   * The components that should be shown in the group. If a component is not listed here, it
   * will not be shown.
   *
   * Components can be listed as a boolean value, in which case the component
   * configuration is fetched from the available form components. If a component is
   * listed as a custom configuration, it will be shown with the given title and icon.
   */
  components: AnyComponentSchema['type'][];
}
