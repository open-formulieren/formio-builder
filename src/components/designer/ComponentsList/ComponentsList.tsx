import type {AnyComponentSchema} from '@open-formulieren/types';
import {useId, useState} from 'react';
import {useIntl} from 'react-intl';

import type {ComponentDefinition, ComponentGroup, PresetComponentDefinition} from '../types';
import {PresetComponentsGroup, RegularComponentsGroup} from './ComponentsGroup';
import './ComponentsList.scss';

export interface ComponentsListProps {
  /**
   * Mapping of component types to their builder information. This information should be
   * retrieved from the Formio registry in the backend.
   */
  components: Record<AnyComponentSchema['type'], ComponentDefinition>;
  /**
   * The regular component groups that are shown in the builder.
   */
  groups: ComponentGroup[];
  /**
   * Custom-defined component presets that are shown in the builder.
   */
  presets: PresetComponentDefinition[];
}

const ComponentsList: React.FC<ComponentsListProps> = ({groups, presets, components}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const intl = useIntl();
  const id = useId();

  return (
    <div className="offb-components-list">
      <input
        className="form-control offb-components-list__search-input"
        type="search"
        placeholder={intl.formatMessage({
          description: 'Components list search input placeholder',
          defaultMessage: 'Search component(s)',
        })}
        value={searchQuery}
        onChange={event => setSearchQuery(event.target.value)}
        aria-label={intl.formatMessage({
          description: 'Components list search input accessible label',
          defaultMessage: 'Search component(s)',
        })}
      />

      {groups
        .sort((groupA, groupB) => groupA.weight - groupB.weight)
        .map(group => (
          <RegularComponentsGroup
            key={`${id}-${group.name}`}
            query={searchQuery}
            testId={`component-group--${group.name}`}
            group={group}
            components={components}
          />
        ))}
      <PresetComponentsGroup
        query={searchQuery}
        testId="component-group--preset"
        presets={presets}
      />
    </div>
  );
};

export default ComponentsList;
