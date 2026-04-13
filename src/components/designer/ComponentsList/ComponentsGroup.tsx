import type {AnyComponentSchema} from '@open-formulieren/types';
import clsx from 'clsx';
import type {ExtendedComponentSchema} from 'formiojs/types/components/schema';
import {useId, useMemo} from 'react';
import {FormattedMessage, defineMessages, useIntl} from 'react-intl';

import {getRegistryEntry} from '@/registry';

import type {
  ComponentDefinition,
  ComponentGroup,
  GroupName,
  PresetComponentDefinition,
} from '../types';
import './ComponentsGroup.scss';

const COMPONENT_GROUP_LABELS = defineMessages<GroupName | 'preset'>({
  custom: {
    description: 'Regular components group label',
    defaultMessage: 'Form fields',
  },
  custom_layout: {
    description: 'Layout components group label',
    defaultMessage: 'Layout',
  },
  custom_special: {
    description: 'Special components group label',
    defaultMessage: 'Special fields',
  },
  preset: {
    description: 'Preset components group label',
    defaultMessage: 'Preset',
  },
});

interface RegularComponentsGroupProps {
  testId: string;
  query: string;
  group: ComponentGroup;
  components: Record<AnyComponentSchema['type'], ComponentDefinition>;
}

/**
 * Wrapper component for rendering component groups with regular, Open Forms backend defined, form components.
 *
 * The wrapper component is responsible for fetching the component definitions from the registry
 * and passing that information along to the `BasicComponentsGroup` component.
 */
export const RegularComponentsGroup: React.FC<RegularComponentsGroupProps> = ({
  testId,
  query,
  group,
  components,
}) => {
  const intl = useIntl();
  const componentDefinitions = useMemo(
    () =>
      group.components.map<GroupComponentDefinition>(componentType => {
        const component = components[componentType];
        const {formDesigner} = getRegistryEntry(component.builderInfo.schema);

        return {
          key: componentType,
          label: formDesigner.label(intl),
          icon: formDesigner.icon,
          schema: component.builderInfo.schema,
        };
      }),
    [components, group.components, intl]
  );

  return (
    <GenericComponentsGroup
      query={query}
      testId={testId}
      isDefault={group.default}
      title={<FormattedMessage {...COMPONENT_GROUP_LABELS[group.name]} />}
      componentDefinitions={componentDefinitions}
    />
  );
};

interface PresetComponentsGroupProps {
  testId: string;
  query: string;
  presets: PresetComponentDefinition[];
}

/**
 * Wrapper component for rendering component groups with custom-defined preset components.
 */
export const PresetComponentsGroup: React.FC<PresetComponentsGroupProps> = ({
  testId,
  query,
  presets,
}) => (
  <GenericComponentsGroup
    query={query}
    testId={testId}
    title={<FormattedMessage {...COMPONENT_GROUP_LABELS.preset} />}
    componentDefinitions={presets.map(p => ({
      ...p,
      label: p.title,
    }))}
  />
);

type GroupComponentDefinition = {
  key: string;
  label: string;
  icon: string;
  // The schema can be either a regular component schema or a custom-defined preset component schema.
  schema: AnyComponentSchema | ExtendedComponentSchema;
};

interface GenericComponentsGroupProps {
  testId: string;
  query: string;
  isDefault?: boolean;
  title: React.ReactNode;
  componentDefinitions: GroupComponentDefinition[];
}

/**
 * Component for rendering a group of components.
 *
 * This component is responsible for rendering a group of components, including filtering
 * and (future) drag-and-drop behaviour.
 *
 * This component should not be implemented directly, but rather used by the
 * `RegularComponentsGroup` and `PresetComponentsGroup` components.
 */
const GenericComponentsGroup: React.FC<GenericComponentsGroupProps> = ({
  testId,
  query,
  isDefault,
  title,
  componentDefinitions,
}) => {
  const id = useId();
  const searchQuery = query.toLowerCase();
  const isSearching = searchQuery !== '';

  const filteredComponents = !isSearching
    ? componentDefinitions
    : componentDefinitions.filter(componentDefinition => {
        const searchTerms = [componentDefinition.key, componentDefinition.label.toLowerCase()];
        return searchTerms.some(term => term.includes(searchQuery));
      });

  if (filteredComponents.length === 0) return null;

  return (
    <details
      // Allowing multiple groups to be open at the same time when searching.
      name={isSearching ? undefined : 'component-group'}
      open={isSearching || isDefault}
      className="offb-component-group card border"
      data-testid={testId}
    >
      <summary className="card-header bg-default">
        <span className="card-title">{title}</span>
      </summary>

      <div className="card-body p-2">
        <ul className="list-unstyled mb-0">
          {filteredComponents.map((component, index) => (
            <li key={`${id}-${index}`}>
              <button
                type="button"
                className={clsx(
                  'btn',
                  'btn-outline-primary',
                  'btn-block',
                  'btn-sm',
                  'text-left',
                  'border-0',
                  'offb-component-group__component-button'
                )}
              >
                <i className={clsx('fa', `fa-${component.icon}`, 'mr-2')} aria-hidden="true" />
                {component.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
};
